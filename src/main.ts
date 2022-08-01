/**
 *  main.ts of project stock-chart
 *  @date 2022/7/25 13:45
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import StockChart from './index'

const chart = new StockChart('#app')

chart.setData([
  {
    open: 1,
    high: 1,
    low: 1,
    close: 1,
    date: 1,
    DT: new Date(),
    volume: 1,
  },
])
