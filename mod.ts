export type Parser<T, S = unknown> = (ctx: Context<S>) => T;

export type Context<S = unknown> = {
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

export const str = <S>(match: string): Parser<string, S> =>
  attempt((ctx) => {
    const endIdx = ctx.index + match.length;
    if (ctx.text.substring(ctx.index, endIdx) === match) {
      return match;
    } else {
      throw expect(match);
    }
  });
