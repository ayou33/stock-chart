/**
 *  options.ts of project stock-chart
 *  @date 2022/7/26 11:25
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from './interface/IAxis'

export type MainAxisOptions = {
  height: number;
}

export const mainAxisOptions: MainAxisOptions = {
  height: 100,
}

export type SeriesOptions = {
  position: 'right';
}

export const seriesOptions: SeriesOptions = {
  position: 'right',
}

export type LayoutOptions = {
  axisHeight: number;
  seriesWidth: number;
  borderWidth: number;
  axisBorderWidth?: number;
  seriesBorderWidth?: number;
  padding: BorderGap;
}

export const layoutOptions: LayoutOptions = {
  axisHeight: 20,
  seriesWidth: 20,
  borderWidth: 2,
  axisBorderWidth: 2,
  seriesBorderWidth: 2,
  padding: 0,
}

export type StockChartOptions = {
  container: string;
  symbol: string;
  display: {
    theme: 'light';
    crosshair: boolean;
  },
  layout: LayoutOptions,
  format: {},
  event: {},
}

export const stockChartOptions: StockChartOptions = {
  container: '',
  symbol: '',
  display: {
    theme: 'light',
    crosshair: true,
  },
  layout: layoutOptions,
  format: {},
  event: {},
}

export default stockChartOptions

export type RendererOptions = {
  container: ContainerCell;
  yAxis: IAxis;
  xAxis: IAxis;
  context?: CanvasRenderingContext2D;
  autoStroke?: boolean;
}
