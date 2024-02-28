import {
  Application,
  Context,
  Router,
  ServerSentEvent,
  Status,
} from "https://deno.land/x/oak@v13.2.5/mod.ts";
import { loadConfig } from "./config.ts";
import { exporter } from "./prometheus_exporter.ts";

const kv = await Deno.openKv();
export const config = loadConfig()

export async function main() {
  const processWatcherWorker = new Worker(
    new URL("./proc_watcher_worker.ts", import.meta.url).href,
    {
      type: "module",
    },
  );

  processWatcherWorker.onmessage = async (e) => {
    if (e.data.source === "system") {
      const system = {
        meminfo: e.data.values.meminfo,
        cpuinfo: e.data.values.cpu,
      };
      await kv.set(["system"], system, { expireIn: 1 });
    }

    if (e.data.source === "pids") {
      await kv.set(["pids"], [e.data.values], { expireIn: 1 });
    }
  };

  if (config.config.enable_gui) {
    const port = config.config.port;
    const app = new Application();
    const router = new Router();

    router
      .get("/", async (ctx) => {
        await ctx.send(
          {
            root: `${Deno.cwd()}/web_test`,
            path: "index.html",
          },
        );
      });

    router.get("/sse", async (ctx: Context) => {
      ctx.assert(
        ctx.request.accepts("text/event-stream"),
        Status.UnsupportedMediaType,
      );

      const target = ctx.sendEvents();
      const id = setInterval(async () => {
        const pids = await kv.get(["pids"]);
        const system = await kv.get(["system"]);
        const evt = new ServerSentEvent(
          "message",
          { data: { pids: pids.value, system: system.value } },
        );

        target.dispatchEvent(evt);
      }, 2500);

      target.addEventListener("close", () => {
        clearInterval(id);
      });
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
    await app.listen({ port: port });
  }
}

if (import.meta.main) {
  main();
}
