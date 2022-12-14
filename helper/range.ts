/**
 *  @file         src/helper/range.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/22 16:17
 *  @description
 */
export type BoundaryFlag = 'left' | 'right' | 'both' | 'none'

export function isIn (from: number, to: number, include: BoundaryFlag = 'both') {
  if (include === 'left') return (n: number) => n >= from && n < to
  if (include === 'right') return (n: number) => n > from && n <= to
  if (include === 'none') return (n: number) => n > from && n < to
  return (n: number) => n >= from && n <= to
}

export function isOut (from: number, to: number, include: BoundaryFlag = 'both') {
  const test = isIn(from, to, include)
  return (n: number) => !test(n)
}

export default isIn
