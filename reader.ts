const files: Array<string> = [
  "/proc/meminfo", // Memory stats
  "/proc/cpuinfo", // CPU info
  "/proc/{pid}/smaps",
];

export function readProcDir(): Array<string> {
  const tmp: Array<string> = [];
  for (const dir of Deno.readDirSync("/proc")) {
    if (dir.isDirectory && parseInt(dir.name)) {
      tmp.push(dir.name);
    }
  }
  return tmp;
}

export function readMeminfo(): string {
  const decoder = new TextDecoder();
  return decoder.decode(Deno.readFileSync(files[0]));
}

export function readCpuinfo(): string {
  const decoder = new TextDecoder();
  return decoder.decode(Deno.readFileSync(files[1]));
}

export function readPidSmaps(pid: string): string {
  try {
    const statPath = files[2].replace("{pid}", pid);
    const decoder = new TextDecoder();
    const file = Deno.readFileSync(statPath);
    return decoder.decode(file);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // console.log(error);
      return "";
    }
  }
  return "";
}
