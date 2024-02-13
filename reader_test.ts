import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from "https://deno.land/std@0.214.0/assert/mod.ts";
import {
  readCpuinfo,
  readMeminfo,
  readPidStat,
  readProcDir,
} from "./reader.ts";

Deno.test(function test_reader() {
  const dirs = readProcDir();
  assertNotEquals(dirs, [] as any);
  assertExists(dirs);
});

Deno.test(function test_read_meminfo() {
  const meminfo = readMeminfo();
  assertNotEquals(meminfo, "");
});

Deno.test(function test_read_cpuinfo() {
  const cpuinfo = readCpuinfo();
  assertNotEquals(cpuinfo, "");
});

Deno.test(function test_read_pid_stat() {
  const pidstat = readPidStat(100);
  assertNotEquals(pidstat, "");
});
