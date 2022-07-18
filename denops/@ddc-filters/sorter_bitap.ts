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
    const source = ` ${trimmed} `;
    const { match } = Asearch(source, { ignoreCase });
    const len = Math.min(trimmed.length, getMaxDistance.length - 1);

    return Promise.resolve(
      candidates.sort((a, b) => {
        if (typeof a.user_data !== "number") {
          const result = match(a.word, getMaxDistance[len]);
          a.user_data = result.found
            ? result.distance
            : getMaxDistance[len] + 1;
        }
        if (typeof b.user_data !== "number") {
          const result = match(b.word, getMaxDistance[len]);
          b.user_data = result.found
            ? result.distance
            : getMaxDistance[len] + 1;
        }

        const diff = parseInt(`${a.user_data}`) - parseInt(`${b.user_data}`);
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
