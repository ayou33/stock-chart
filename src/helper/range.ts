/**
 *  @file         src/helper/range.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/22 16:17
 *  @description
 */
export type BoundaryFlag = 'left' | 'right' | 'both' | 'none'

export function isIn (from: number, to: number, flag: BoundaryFlag = 'both') {
  return (n: number) => {
    if (flag === 'both') return n >= from && n <= to
    if (flag === 'none') return n > from && n < to
    if (flag === 'left') return n >= from && n < to
    return n > from && n <= to
  }
}

export function isOut (from: number, to: number, flag: BoundaryFlag = 'both') {
  return !isIn(from, to, flag)
}

export default isIn
