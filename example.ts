import { attempt, Parser, str } from "./mod.ts";

export const foobar: Parser<string> = attempt((ctx) => {
  const foo = str("foo")(ctx);
  const bar = str("bar")(ctx);
  return foo + bar;
});

export const orFooBarBaz: Parser<string> = (ctx) => {
  for (const match of ["foo", "bar", "baz"]) {
    try {
      const res = str(match)(ctx);
      return res;
    } catch {
      continue;
    }
  }
  throw `expect foo | bar | baz`;
};

if (import.meta.main) {
  const text = "fooba";
  const ctx = { text, index: 0, state: null };
  try {
    const res = foobar(ctx);
    console.log(res);
  } finally {
    console.log(ctx);
  }
}
