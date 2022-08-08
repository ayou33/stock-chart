/**
 *  extend.ts of project stock-chart
 *  @date 2022/7/25 18:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { mergeAll } from 'ramda'

const extend = <T extends any[]> (...args: T) => mergeAll(args)

export default extend
