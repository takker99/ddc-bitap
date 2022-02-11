import { Asearch, BaseFilter, Candidate, FilterArguments } from "../../deps.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(
    { candidates, completeStr, sourceOptions: { ignoreCase } }: FilterArguments<
      Params
    >,
  ): Promise<Candidate[]> {
    const { test } = Asearch(completeStr, { ignoreCase });

    return Promise.resolve(
      candidates.filter(({ word }) => {
        const threshold = Math.min(Math.floor(word.length / 2), 3) as
          | 0
          | 1
          | 2
          | 3;
        return test(word, threshold);
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
