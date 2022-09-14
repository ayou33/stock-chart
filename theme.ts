/**
 *  theme.ts of project stock-chart
 *  @date 2022/8/18 11:37
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export type Color = string | CanvasGradient | CanvasPattern

export const BLACK = '#000'

export const WHITE = '#fff'

export const NONE = 'rgba(0, 0, 0, 0)'

export type ThemeOptions = {
  color: Color;
  background: Color;
  mountainColor: Color;
  dashedColor: Color;
  dottedColor: Color;
  primaryColor: Color;
  bullishColor: Color; // 看多颜色
  bullishBg: Color;
  bearishBg: Color;
  bearishColor: Color;
  lineWidth: number;
  dashWidth: number;
  dashArray: number[];
  dotArray: number[];
  fontSize: number;
}

export const themeOptions: ThemeOptions = {
  fontSize: 10,
  lineWidth: 0.5,
  dashWidth: 0.5,
  dashArray: [4, 4],
  dotArray: [2, 2],
  bullishColor: '#00B167', // 看多颜色
  bearishColor: '#F24A3A',
  bullishBg: 'rgba(0, 177, 103, 0.1)', // 看多颜色
  bearishBg: 'rgba(242, 74, 58, 0.1)',
  color: BLACK,
  background: 'rgba(0, 0, 0, 0.1)',
  dashedColor: '#FCE9D6',
  dottedColor: '#F19231',
  primaryColor: '#326BFE',
  mountainColor: '#E6EDFE',
}
