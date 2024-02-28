import { assertNotEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";
import CpuinfoParse, { extractAndMergeCpuInfo } from "./cpuinfo_parser.ts";
import { readCpuinfo } from "./reader.ts";

Deno.test(function test_cpuinfo_parser() {
  const cpuinfo = readCpuinfo();
  const out = CpuinfoParse(cpuinfo);
  assertNotEquals(out, []);
});

Deno.test(function test_cpuinfo_extract() {
  const cpuinfo = readCpuinfo();
  const out = CpuinfoParse(cpuinfo);
  const o = extractAndMergeCpuInfo(out);
  assertNotEquals(o, {});
});
