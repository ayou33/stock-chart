/**
 *  options.ts of project stock-chart
 *  @date 2022/7/26 11:25
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from './interface/IAxis'
import IMainAxis from './interface/IMainAxis'
import LayoutCell from './layout/LayoutCell'
import { Color, themeOptions, ThemeOptions, BLACK, WHITE } from './theme'
import { LayoutDescriber, ReservedRoles } from './layout/Layout'

type BoxPaddingObject = {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type BoxPadding = Partial<BoxPaddingObject> | number

type AxisOptions = {
  tick: null | number; // 不显示或者设置大小
  tickInterval: number;
  labelSize: number;
  labelPadding: number; // padding-top or left
  border: null | number;
  borderColor: Color;
  context?: CanvasRenderingContext2D;
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
  positions: Record<ReservedRoles, Vector>;
}

export const layoutOptions: LayoutOptions = {
  axisHeight: 20,
  seriesWidth: 45,
  padding: 0,
  positions: {
    chart: [0, 0],
    series: [1, 0],
    axis: [0, 1],
    indicator: [0, 2],
  },
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

export type ScaledOptions = {
  yAxis: IAxis;
  xAxis: IMainAxis;
}

export type GraphOptions = ScaledOptions & {
  container: LayoutCell;
  context?: CanvasRenderingContext2D;
}

export const useDescriber = (options: LayoutOptions, describer?: LayoutDescriber) => {
  return describer ?? [
    {
      role: 'chart',
      cells: [
        {
          role: 'chart',
        },
        {
          role: 'series', width: options.seriesWidth,
        },
      ],
    },
    {
      role: 'axis',
      height: options.axisHeight,
      cells: [
        {
          role: 'axis',
        },
        null,
      ],
    },
  ]
}
