/**
 *  random.ts of project stock-chart
 *  @date 2022/8/17 14:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export function getRandomInt (min: number, max: number, inclusive = false) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + +inclusive)) + min //含最大值，含最小值
}

export default getRandomInt
