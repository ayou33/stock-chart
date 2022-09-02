/**
 *  extent.ts of project stock-chart
 *  @date 2022/8/1 16:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface ValueOf<T> {
  (value: T, index: number, values: T[]): number;
}

export const extent = <T extends (number | Record<string, unknown>)> (
  values: T[],
  valueOfMin: ValueOf<T> = x => x as number,
  valueOfMax: ValueOf<T> = valueOfMin,
) => {
  let min = Infinity
  let max = -Infinity
  let index = -1

  for (const value of values) {
    index++
    const _min = valueOfMin(value, index, values)
    const _max = valueOfMax(value, index, values)
    if (_min < min) min = _min
    if (_max > max) max = _max
  }

  return [min, max] as Extent
}

// 这里包含边界重叠的情况
export const isInRange = (
  ref: Extent, extent: Extent): boolean => extent[0] >= ref[0] && extent[1] <= ref[1]

export const isOutOfRange = (
  ref: Extent, extent: Extent): boolean => !isInRange(ref, extent)
