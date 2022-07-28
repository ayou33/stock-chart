/**
 *  options.ts of project stock-chart
 *  @date 2022/7/26 11:25
 *  @author 阿佑[ayooooo@petalmail.com]
 */
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

export type StockChartOptions = {
  container: string;
  symbol: string;
  display: {
    theme: 'light';
    crosshair: boolean;
  },
  layout: {
    margin: BorderGap;
    padding: BorderGap;
    defaultSeries: SeriesOptions;
    mainAxis: MainAxisOptions;
  },
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
  layout: {
    margin: {},
    padding: {},
    mainAxis: mainAxisOptions,
    defaultSeries: seriesOptions,
  },
  format: {},
  event: {},
}

export default stockChartOptions
