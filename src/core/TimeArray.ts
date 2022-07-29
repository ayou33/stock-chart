/**
 *  TimeArray.ts of project stock-chart
 *  @date 2022/7/29 15:22
 *  @author 阿佑[ayooooo@petalmail.com]
 */
class TimeArray<T = number> implements Iterable<T> {
  private readonly _data: T[] = []
  readonly length = 0

  public [Symbol.iterator] () {
    return this._data[Symbol.iterator]()
  }

  push (item: T): this {
  }

  unshift (items: T[]): this {
  }

  subArray (begin: number, count: number): T[] {
  }

  slice (begin: number, end: number): T[] {
  }

  item (index: number): T | undefined {
  }

  first (): T | undefined {
  }

  value (): T[] {
    return []
  }
}

export default TimeArray
