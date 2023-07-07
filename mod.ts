/**
 * @file Many parsers adapted from Deno `x/combine` and Lean4 core.
 */

export type Parser<T, S> = (ctx: Context<S>) => T;

export type Context<S> = {
  text: string;
  index: number;
  state: S;
};

export class ParthrocError extends Error {
  cause?: ParthrocError[];
  constructor(message: string, cause?: ParthrocError[]) {
    super();
    this.message = message;
    this.cause = cause;
  }
}

export const attempt = <T, S>(p: Parser<T, S>): Parser<T, S> => (ctx) => {
  const idx = ctx.index;
  try {
    const res = p(ctx);
    return res;
  } catch (err) {
    ctx.index = idx;
    throw err;
  }
};

export const regex = <S>(re: RegExp): Parser<string, S> => (ctx) => {
  const gRe = new RegExp(
    re.source,
    re.global ? re.flags : `${re.flags}g`,
  );
  gRe.lastIndex = ctx.index;
  const res = gRe.exec(ctx.text);
  if (res && res.index === ctx.index) {
    ctx.index += res[0].length;
    return res[0];
  } else {
    throw new ParthrocError(`Expect ${re.source}`);
  }
};
