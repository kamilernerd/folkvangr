import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from "https://deno.land/std@0.214.0/assert/mod.ts";
import MeminfoParser from "./meminfo_parser.ts";
import { readMeminfo } from "./reader.ts";

Deno.test(function test_meminfo_parser() {
  const raw = readMeminfo();
  const out = MeminfoParser(raw);
  assertNotEquals(out, []);
});
