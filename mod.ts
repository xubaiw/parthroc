/**
 * @file Many parsers adapted from Deno `x/combine` and Lean4 core.
 */

export type Parser<T, S> = (ctx: Context<S>) => T;

export type Context<S> = {
  text: string;
  index: number;
  state: S;
};

export type Result<T> = Success<T> | Failure;

export type Success<T> = {
  success: true;
  value: T;
};

export type Failure = {
  success: false;
  reason: Reason;
};

export const SYMBOL = Symbol();

export type Reason = {
  symbol: typeof SYMBOL;
  expected: string;
};

export const expect = (expected: string): Reason => ({
  symbol: SYMBOL,
  expected,
});

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

export const safen = <T, S>(p: Parser<T, S>): Parser<Result<T>, S> => (ctx) => {
  try {
    const value = p(ctx);
    return { success: true, value };
  } catch (e) {
    if (e.symbol == SYMBOL) {
      return { success: false, reason: e };
    }
    throw e;
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
    throw expect(re.source);
  }
};
