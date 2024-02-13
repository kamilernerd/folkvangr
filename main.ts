// import { debounce } from "https://deno.land/std@0.207.0/async/debounce.ts";

import { readMeminfo, readPidStat } from "./reader.ts";

export async function main() {
  const processWatcherWorker = new Worker(
    new URL("./process_worker.ts", import.meta.url).href,
    {
      type: "module",
    },
  );

  processWatcherWorker.onmessage = async (e) => {
    // const stat = readMeminfo();
    // console.log(stat);
  };
}

if (import.meta.main) {
  main();
}
