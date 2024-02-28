import CpuinfoParse, { extractAndMergeCpuInfo } from "./cpuinfo_parser.ts";
import MeminfoParse from "./meminfo_parser.ts";
import {
  readCpuinfo,
  readMeminfo,
  readPidSmaps,
  readProcDir,
} from "./reader.ts";
import PidSmapsParse from "./smaps_parser.ts";

declare global {
  interface Window {
    postMessage: any;
  }
}

// Timeout in ms
const TIMEOUT = 2500;

function callback() {
  const pids = readProcDir();
  const cpuinfo = readCpuinfo();
  const meminfo = readMeminfo();

  const parsedMeminfo = MeminfoParse(meminfo);
  const parsedCpuInfo = CpuinfoParse(cpuinfo);
  const extractedCpuInfo = extractAndMergeCpuInfo(parsedCpuInfo);

  self.postMessage({
    source: "system",
    values: {
      cpu: extractedCpuInfo,
      meminfo: parsedMeminfo,
    },
  });

  let pidsMemUsageAll: any = [];
  for (const pid in pids) {
    const p = readPidSmaps(pids[pid]);
    if (p === "") {
      continue;
    }

    // Pidstat is too big for Deno.kv to store
    // so we read only the values we need for each PID
    const pidStat = PidSmapsParse(p);

    pidsMemUsageAll.push({
      pid: pids[pid],
      meminfo: {
        Size: pidStat["Size"].value,
        Rss: pidStat["Rss"].value,
        Pss: pidStat["Pss"].value,
      },
    });
  }

  self.postMessage({
    source: "pids",
    values: pidsMemUsageAll,
  });

  pidsMemUsageAll = [];

  setTimeout(callback, TIMEOUT);
}

callback();
