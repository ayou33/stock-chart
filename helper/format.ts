/**
 *  format.ts of project stock-chart
 *  @date 2022/8/15 17:14
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export function expandPadding (padding: BoxPadding): BoxPaddingObject {
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    }
  }

  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0,
  }
}
