/**
 *  options.ts of project stock-chart
 *  @date 2022/7/26 11:25
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from './interface/IAxis'
import IMainAxis from './interface/IMainAxis'

const BLACK = '#000'
const WHITE = '#fff'

type Color = string | CanvasGradient | CanvasPattern

export type ThemeOptions = {
  color: Color;
  background: Color;
  mountainColor: Color;
  dashColor: Color;
  activeColor: Color;
  bullishColor: Color; // 看多颜色
  bearishColor: Color;
  lineWidth: number;
  dashWidth: number;
  dashArray: number[];
  fontSize: number;
}

const themeOptions: ThemeOptions = {
  fontSize: 10,
  lineWidth: 1,
  dashWidth: 1,
  dashArray: [8, 2, 2, 2],
  bullishColor: '#00B167', // 看多颜色
  bearishColor: '#F24A3A',
  color: BLACK,
  background: 'rgba(0, 0, 0, 0.1)',
  dashColor: '#F19231',
  activeColor: '#326BFE',
  mountainColor: '#E6EDFE',
}

type AxisOptions = {
  tick: false | number; // 不显示或者设置大小
  tickColor: Color;
  tickCount: number;
  tickInterval: number;
  labelSize: number;
  labelPadding: number;
  border: false | number;
  borderColor: Color;
  currentLabel: false | {
    color: Color;
    background: Color;
    fontSize: number;
    padding: number;
  };
}

const axisOptions: AxisOptions = {
  tick: 4,
  tickColor: themeOptions.color,
  tickCount: 0,
  tickInterval: 50,
  labelSize: themeOptions.fontSize,
  labelPadding: 0,
  border: false,
  borderColor: themeOptions.color,
  currentLabel: {
    color: WHITE,
    background: themeOptions.dashColor,
    fontSize: themeOptions.fontSize,
    padding: 0,
  },
}

type RequiredMainAxisOptions = {
  container: ContainerCell;
}

type OptionalMainAxisOptions = Partial<{
  position: 'top' | 'bottom';
} & AxisOptions>

export type MainAxisOptions = OptionsOf<RequiredMainAxisOptions, OptionalMainAxisOptions>

export const mainAxisOptions: Required<OptionalMainAxisOptions> = {
  position: 'bottom',
  ...axisOptions,
}

type RequiredSeriesOptions = {
  container: ContainerCell
}

type OptionalSeriesOptions = Partial<{
  position: 'right' | 'left';
} & AxisOptions>

export type SeriesOptions = OptionsOf<RequiredSeriesOptions, OptionalSeriesOptions>

export const seriesOptions: Required<OptionalSeriesOptions> = {
  position: 'right',
  ...axisOptions,
}

export type LayoutOptions = {
  axisHeight: number;
  seriesWidth: number;
  padding: BorderGap;
}

export const layoutOptions: LayoutOptions = {
  axisHeight: 20,
  seriesWidth: 20,
  padding: 0,
}

export type CrosshairOptions = {
  dashArray: number[];
  color: Color;
  lineWidth: number;
}

export type GridOptions = {
  horizontal: false | Color;
  vertical: false | Color;
}

export type StockChartOptions = {
  container: string;
  symbol: string;
  theme: 'light' | 'dark' | ThemeOptions;
  crosshair: false | CrosshairOptions;
  grid: false | GridOptions;
  series: SeriesOptions['partial'];
  axis: MainAxisOptions['partial'];
  layout: LayoutOptions,
}

export const stockChartOptions: StockChartOptions = {
  container: '',
  symbol: '',
  theme: themeOptions,
  crosshair: {
    dashArray: themeOptions.dashArray,
    color: themeOptions.dashColor,
    lineWidth: themeOptions.dashWidth,
  },
  grid: {
    horizontal: themeOptions.background,
    vertical: themeOptions.background,
  },
  series: seriesOptions,
  axis: mainAxisOptions,
  layout: layoutOptions,
}

export default stockChartOptions

export type RendererOptions = {
  container: ContainerCell;
  yAxis: IAxis;
  xAxis: IMainAxis;
  context?: CanvasRenderingContext2D;
  autoStroke?: boolean;
}
