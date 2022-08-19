/**
 *  options.ts of project stock-chart
 *  @date 2022/7/26 11:25
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Layout from './core/Layout'
import IAxis from './interface/IAxis'
import IMainAxis from './interface/IMainAxis'
import { Color, themeOptions, ThemeOptions, BLACK, WHITE } from './theme'

type AxisOptions = {
  tick: null | number; // 不显示或者设置大小
  tickInterval: number;
  labelSize: number;
  labelPadding: number; // padding-top or left
  border: null | number;
  borderColor: Color;
}

const axisOptions: AxisOptions = {
  tick: 4,
  tickInterval: 80,
  labelSize: themeOptions.fontSize,
  labelPadding: 4,
  border: 1,
  borderColor: themeOptions.color,
}

export type LabelStyle = {
  color: Color;
  padding: BoxPadding;
  fontSize: number;
  background?: Color;
  dashArray: number[];
  lineWidth: number;
}

const labelStyle: LabelStyle = {
  color: WHITE,
  padding: 2,
  fontSize: themeOptions.fontSize,
  background: BLACK,
  dashArray: themeOptions.dashArray,
  lineWidth: themeOptions.lineWidth,
}

const currentPriceLabel: LabelStyle = {
  ...labelStyle,
  background: themeOptions.dottedColor,
  dashArray: themeOptions.dotArray,
}

export type MainAxisOptions = {
  position: 'top' | 'bottom';
  focus: LabelStyle | null;
} & AxisOptions

export const mainAxisOptions: MainAxisOptions = {
  ...axisOptions,
  position: 'bottom',
  focus: labelStyle,
}

export type SeriesOptions = {
  position: 'right' | 'left';
  currentPrice: LabelStyle | null;
  focus: LabelStyle | null;
} & AxisOptions

export const seriesOptions: SeriesOptions = {
  ...axisOptions,
  position: 'right',
  currentPrice: currentPriceLabel,
  focus: labelStyle,
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

export type GridOptions = {
  horizontal: null | Color;
  vertical: null | Color;
}

export type DataSourceOptions = {
  autoFeed: boolean;
}

export type StockChartOptions = {
  root: string;
  symbol: string;
  theme: 'light' | 'dark' | ThemeOptions;
  crosshair: null | LabelStyle;
  currentPrice: null | LabelStyle;
  grid: null | GridOptions;
  defaultSeries: SeriesOptions;
  mainAxis: MainAxisOptions;
  layout: LayoutOptions;
  dataSource: DataSourceOptions;
}

export const stockChartOptions: StockChartOptions = {
  root: '',
  symbol: '',
  theme: themeOptions,
  crosshair: labelStyle,
  currentPrice: currentPriceLabel,
  grid: {
    horizontal: themeOptions.background,
    vertical: themeOptions.background,
  },
  defaultSeries: seriesOptions,
  mainAxis: mainAxisOptions,
  layout: layoutOptions,
  dataSource: {
    autoFeed: true,
  },
}

export default stockChartOptions

export type RenderOptions = {
  container: ContainerCell;
  yAxis: IAxis;
  xAxis: IMainAxis;
  context?: CanvasRenderingContext2D;
}

export type RendererOptions = RenderOptions & StockChartOptions
