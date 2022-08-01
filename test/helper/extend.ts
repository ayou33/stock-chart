/**
 *  extend.ts of project stock-chart
 *  @date 2022/8/1 19:01
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import extend from '../../src/helper/extend'

describe('extend', () => {
  const o = { a: 1 }

  const extended = extend(o, { a: 2 })

  expect(extended.a).toBe(2)
})
