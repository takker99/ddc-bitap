import { Asearch, BaseFilter, FilterArguments, Item } from "../../deps.ts";
import { getMaxDistance } from "./distance.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(
    { candidates, completeStr, sourceOptions: { ignoreCase } }: FilterArguments<
      Params
    >,
  ): Promise<Item[]> {
    const trimmed = completeStr.trim();
    if (trimmed.length === 0) return Promise.resolve(candidates);

    const source = ` ${trimmed} `;
    const { match } = Asearch(source, { ignoreCase });
    const len = Math.min(trimmed.length, getMaxDistance.length - 1);

    return Promise.resolve(
      candidates.flatMap(({ user_data: _, ...candidate }) => {
        const result = match(candidate.word, getMaxDistance[len]);
        return result.found
          ? [{ ...candidate, user_data: result.distance }]
          : [];
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
