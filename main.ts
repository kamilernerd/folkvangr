import {
  Application,
  Context,
  Router,
  ServerSentEvent,
  Status,
} from "https://deno.land/x/oak@v13.2.5/mod.ts";
import { loadConfig } from "./config.ts";
// import { exporter } from "./prometheus_exporter.ts";
import { EventEmitter } from "https://deno.land/std@0.110.0/node/events.ts";

export const config = loadConfig()
export const data_pipe = new BroadcastChannel("data_pipe")

const eventEmitter = new EventEmitter()

export async function main() {
  const processWatcherWorker = new Worker(
    new URL("./proc_watcher_worker.ts", import.meta.url).href,
    {
      type: "module",
    },
  );

	data_pipe.onmessage = async (e) => {
		eventEmitter.emit("data", e.data)
	}

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

			eventEmitter.on("data", (e) => {
		 		const evt = new ServerSentEvent(
          "message",
          { data: { ...e } },
        );
        target.dispatchEvent(evt);
			})
    });

    app.use(router.routes());
    app.use(router.allowedMethods());
    await app.listen({ port: port });
  }
}

if (import.meta.main) {
  main();
}
