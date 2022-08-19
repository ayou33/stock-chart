/**
 *  extend.ts of project stock-chart
 *  @date 2022/7/25 18:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { mergeDeepRight } from 'ramda'

const extend = <T extends object, U extends object> (dft: T, o: U) => mergeDeepRight(dft, o) as T & U

export default extend
