/**
 *  idMaker.ts of project stock-chart
 *  @date 2022/8/2 15:41
 *  @author 阿佑[ayooooo@petalmail.com]
 */
function* idGenerator () {
  let id = 0
  while (true) {
    yield id++
  }
}

const idMaker = <T = number> (format?: (id: number) => T) => {
  const generator = idGenerator()
  let next = generator.next()

  return {
    next (): T {
      next = generator.next()
      const value = next.value
      if (typeof format === 'function') return format(value as number)
      return value as any as T
    },
    value () {
      return next.value
    }
  }
}

export default idMaker
