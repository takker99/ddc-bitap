import { BaseFilter, FilterArguments, Item } from "../../deps.ts";
import { getMaxDistance } from "./distance.ts";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override filter(
    { candidates, completeStr }: FilterArguments<
      Params
    >,
  ): Promise<Item[]> {
    const len = Math.min(completeStr.trim().length, getMaxDistance.length - 1);

    return Promise.resolve(
      candidates.sort((a, b) => {
        const adist = typeof a.user_data === "number"
          ? a.user_data
          : getMaxDistance[len] + 1;
        const bdist = typeof b.user_data === "number"
          ? b.user_data
          : getMaxDistance[len] + 1;

        const diff = adist - bdist;
        if (diff !== 0) return diff;
        const lenDiff = a.word.length - b.word.length;
        if (lenDiff !== 0) return lenDiff;
        return a.word.localeCompare(b.word);
      }),
    );
  }
  override params(): Params {
    return {};
  }
}
