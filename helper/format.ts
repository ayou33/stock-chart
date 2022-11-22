/**
 *  format.ts of project stock-chart
 *  @date 2022/8/15 17:14
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { BoxPadding, BoxPaddingObject } from '../options'

export function expandPadding (padding: BoxPadding): BoxPaddingObject {
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    }
  }

  const top = padding.top ?? 0
  const right = padding.right ?? top
  const bottom = padding.bottom ?? right
  const left = padding.left ?? bottom

  return {
    top,
    right,
    bottom,
    left,
  }
}
