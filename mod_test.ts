import { assertThrows } from "https://deno.land/std@0.193.0/testing/asserts.ts";
import { regex } from "./mod.ts";

Deno.test("regex", () => {
  regex(/[abc]/)({ text: "a", index: 0, state: null });
  assertThrows(() => regex(/[abc]/)({ text: "d", index: 0, state: null }));
});
