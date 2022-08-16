/**
 *  createDataGenerator.ts of project stock-chart
 *  @date 2022/8/16 18:53
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export function createDataGenerator (consume: (bar: Bar, isCreate = false) => void) {
  function start(from: number, interval: number) {}

  function insert (time: number, price: number) {}

  function stop () {}

  return {
    insert,
    stop,
    start,
  }
}

export default createDataGenerator
