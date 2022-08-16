/**
 *  extend.ts of project stock-chart
 *  @date 2022/7/25 18:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { mergeDeepRight } from 'ramda'

const extend = <U extends object, T extends object> (dft: T, o: U) => mergeDeepRight(dft, o) as T

export default extend
