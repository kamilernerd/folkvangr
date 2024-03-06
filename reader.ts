const files: Array<string> = [
  "/proc/meminfo", 		 // Memory stats
  "/proc/cpuinfo", 		 // CPU info
  "/proc/{pid}/smaps", // Pid maps (memory information)
	"/proc/{pid}/exe", 	 // The symlink of process binary
];

export function readProcDir(): Array<string> {
  try {
    const tmp: Array<string> = [];
    for (const dir of Deno.readDirSync("/proc")) {
      if (dir.isDirectory && parseInt(dir.name)) {
        tmp.push(dir.name);
      }
    }
    return tmp;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // console.log(error);
      return [];
    }
  }
  return []
}

export function readMeminfo(): string {
  try {
    const decoder = new TextDecoder();
    return decoder.decode(Deno.readFileSync(files[0]));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // console.log(error);
      return "";
    }
  }
  return ""
}

export function readCpuinfo(): string {
  try {
    const decoder = new TextDecoder();
    return decoder.decode(Deno.readFileSync(files[1]));
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // console.log(error);
      return "";
    }
  }
  return ""
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

export function readPidBinarySymlink(pid: number): string {
  try {
		const path = files[4].replace("{pid}", pid)
		const pidBinary = Deno.readLinkSync(path)
		return pidBinary;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // console.log(error);
      return "";
    }
  }
  return ""
}

