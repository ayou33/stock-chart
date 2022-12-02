/**
 *  @file         stock-chart/helper/assert.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/24 17:00
 *  @description
 */
import { AssertionError } from 'assert'

export function assertIsDefined<T> (value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new AssertionError(
      {
        message: `Expected 'value' to be defined, but received ${value}`,
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
      message: `Expected 'value' is a number, but got ${val}`,
    })
  }
}

export function assertIsNumber (val: unknown): asserts val is number {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    throw new AssertionError({
      message: `Expected 'value' is a number, but got ${val}`,
    })
  }
}
