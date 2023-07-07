# Parthroc

Parsec, but using TypeScript native try-catch and mutable context.

```ts
import { attempt, Parser, str } from "https://denopkg.com/xubaiw/parthroc/mod.ts";

export const foobar: Parser<string> = attempt((ctx) => {
  const foo = str("foo")(ctx);
  const bar = str("bar")(ctx);
  return foo + bar;
});
```
