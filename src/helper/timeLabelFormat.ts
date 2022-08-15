/**
 *  timeLabelFormat.ts of project stock-chart
 *  @date 2022/8/15 11:35
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { Resolution } from '../interface/IDataFeed'
import timeFormat, { formatDay, formatHour, formatMinute, formatMonth, formatSecond, formatYear } from './timeFormat'

export const generateTimeLabelFormat = (r?: Resolution) => {
  switch (r) {
    case Resolution.S1:
    case Resolution.S5:
      return timeFormat(formatSecond)
    case Resolution.M1:
    case Resolution.M5:
    case Resolution.M15:
    case Resolution.M30:
      return timeFormat(formatMinute)
    case Resolution.H1:
    case Resolution.H4:
      return timeFormat(formatHour)
    case Resolution.d1:
    case Resolution.w1:
      return timeFormat(formatDay)
    case Resolution.m1:
    case Resolution.s1:
      return timeFormat(formatMonth)
    case Resolution.y1:
      return timeFormat(formatYear)
  }

  return timeFormat('')
}
