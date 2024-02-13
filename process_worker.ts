import { readPidSmaps, readProcDir } from "./reader.ts";
import PidSmapsParse from "./smaps_parser.ts";

function callback() {
  const pids = readProcDir();

  for (const pid in pids) {
    const p = readPidSmaps(pids[pid]);
    if (p === "") {
      continue;
    }
    const pidStat = PidSmapsParse(p);
    self.postMessage(pidStat);
  }

  setTimeout(callback, 500);
}

setTimeout(callback, 500);
