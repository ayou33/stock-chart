/**
 *  @file         stock-chart/helper/assert.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/24 17:00
 *  @description
 */
import { AssertionError } from 'assert'

export function assertIsDefined<T> (val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError(
      {
        message: `Expected 'val' to be defined, but received ${val}`,
      },
    )
  }
}

export function assert (condition: unknown, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError({
      message: msg ?? `Expected result of condition is truthy, but received ${condition}`,
    })
  }
}

export default assert

export function assertIsString (val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new AssertionError({
      message: 'Not a string!',
    })
  }
}
