import { Asearch, BaseFilter, Candidate, FilterArguments } from "../../deps.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(
    { candidates, completeStr, sourceOptions: { ignoreCase } }: FilterArguments<
      Params
    >,
  ): Promise<Candidate[]> {
    const { match } = Asearch(completeStr, { ignoreCase });

    const matches = new Map<Candidate, number>(
      candidates.map((candidate) => {
        const result = match(candidate.word);
        if (!result.found) return [candidate, 4];
        return [candidate, result.distance];
      }),
    );

    return Promise.resolve(
      candidates.sort((a, b) => {
        const left = matches.get(a) ?? 0;
        const right = matches.get(b) ?? 0;
        return left !== right ? left - right : a.word.length - b.word.length;
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
