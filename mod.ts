export type Parser<T, S = unknown> = (ctx: Context<S>) => T;

export type Context<S = unknown> = {
  text: string;
  index: number;
  state: S;
};

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

export const str = <S>(match: string): Parser<string, S> =>
  attempt((ctx) => {
    const endIdx = ctx.index + match.length;
    if (ctx.text.substring(ctx.index, endIdx) === match) {
      return match;
    } else {
      throw `expect ${match}`;
    }
  });

