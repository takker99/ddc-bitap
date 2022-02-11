import { Asearch, BaseFilter, Candidate, FilterArguments } from "../../deps.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(
    { candidates, completeStr, sourceOptions: { ignoreCase } }: FilterArguments<
      Params
    >,
  ): Promise<Candidate[]> {
    const source = ` ${completeStr.trim()} `;
    const { test } = Asearch(source, { ignoreCase });
    const threshold = Math.min(Math.floor(completeStr.trim().length / 2), 3) as
      | 0
      | 1
      | 2
      | 3;

    return Promise.resolve(
      candidates.filter(({ word }) => test(word, threshold)),
    );
  }
  override params(): Params {
    return {};
  }
}
