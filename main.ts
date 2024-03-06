import { loadConfig } from "./config.ts";
import { serve } from "./http.ts";

export const config = loadConfig()
export const data_pipe = new BroadcastChannel("data_pipe")

export let data = [];

export async function main() {
  const processWatcherWorker = new Worker(
    new URL("./proc_watcher_worker.ts", import.meta.url).href,
    {
      type: "module",
    },
  );

	data_pipe.onmessage = async (e) => {
		data = e.data
		data_pipe.dispatchEvent(new CustomEvent("data", {
			detail: e.data
		}))
	}

	serve()
}

if (import.meta.main) {
  main();
}
