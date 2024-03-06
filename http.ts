import { config, data_pipe } from "./main.ts";
import {
  Application,
  Context,
  Router,
  ServerSentEvent,
  Status,
} from "https://deno.land/x/oak/mod.ts";
import { prometherusRegistryHttphandler } from "./prometheus_exporter.ts";

export async function serve() {
	const port = config.port;
	const app = new Application();
	const router = new Router();

	if (config.enable_prometheus) {
		router.get("/metrics", prometherusRegistryHttphandler)
	}

	if (config.enable_api) {
		router.get("/sse", async (ctx: Context) => {
			ctx.assert(
				ctx.request.accepts("text/event-stream"),
				Status.UnsupportedMediaType,
			);

			const target = ctx.sendEvents();
			const httpSSEhandler = (e) => {
				const evt = new ServerSentEvent(
					"message",
					{
						data: {
							pids: e.detail[0],
							system: e.detail[1]
						}
					},
				);
				target.dispatchEvent(evt);
			}

			data_pipe.addEventListener("data", httpSSEhandler)
			
			target.addEventListener("close", () => {
				data_pipe.removeEventListener("data", httpSSEhandler)
			});
		});
	}

	app.use(router.routes());
	app.use(router.allowedMethods());
	await app.listen({ port: port });
}
