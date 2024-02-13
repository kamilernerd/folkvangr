import {
  assertEquals,
  assertExists,
  assertNotEquals,
} from "https://deno.land/std@0.214.0/assert/mod.ts";
import MeminfoParser from "./meminfo_parser.ts";
import Reader from "./reader.ts";

Deno.test(function test_meminfo_parser() {
  const reader = new Reader();
  const raw = reader.readMeminfo();

  const out = MeminfoParser(raw);
  assertNotEquals(out, []);
});
