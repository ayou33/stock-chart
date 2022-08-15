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
  tick: null | number; // 不显示或者设置大小
  tickInterval: number;
  labelSize: number;
  labelPadding: number; // padding-top
  border: null | number;
  borderColor: Color;
  currentLabel: {
    color: Color;
    background: Color;
    fontSize: number;
    padding: BoxPadding;
  } | null;
}

const axisOptions: AxisOptions = {
  tick: 4,
  tickInterval: 80,
  labelSize: themeOptions.fontSize,
  labelPadding: 0,
  border: 1,
  borderColor: themeOptions.color,
  currentLabel: {
    color: WHITE,
    background: themeOptions.dashColor,
    fontSize: themeOptions.fontSize,
    padding: 2,
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
  tickInterval: 60,
}

export type LayoutOptions = {
  axisHeight: number;
  seriesWidth: number;
  padding: BoxPadding;
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
  horizontal: null | Color;
  vertical: null | Color;
}

export type StockChartOptions = {
  container: string;
  symbol: string;
  theme: 'light' | 'dark' | ThemeOptions;
  crosshair: null | CrosshairOptions;
  grid: null | GridOptions;
  series: Required<OptionalSeriesOptions>;
  axis: Required<OptionalMainAxisOptions>;
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
