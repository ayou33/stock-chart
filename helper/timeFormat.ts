/**
 *  timeFormat.ts of project stock-chart
 *  @date 2022/8/15 11:37
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { ResolutionLiteral } from '../interface/IDataFeed'

export const durationSecond = 1000,
  durationMinute = durationSecond * 60,
  durationHour = durationMinute * 60,
  durationDay = durationHour * 24,
  durationWeek = durationDay * 7,
  durationMonth = durationDay * 30,
  durationYear = durationDay * 365

export const duration = {
  tick: 1,
  millisecond: 1,
  second: durationSecond,
  minute: durationMinute,
  hour: durationHour,
  day: durationDay,
  week: durationWeek,
  month: durationMonth,
  year: durationYear,
}

function timeSecond (date: Date) {
  return new Date(date).setTime(+date - date.getMilliseconds())
}

function timeMinute (date: Date) {
  return new Date().setTime(+date - date.getMilliseconds() - date.getSeconds() * durationSecond)
}

function timeHour (date: Date) {
  return new Date().setTime(
    +date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute)
}

function timeDay (date: Date) {
  return new Date(date).setHours(0, 0, 0, 0)
}

function timeWeek (date: Date) {
  const d = new Date(date)
  d.setDate(d.getDate() - (d.getDay() + 7) % 7)
  d.setHours(0, 0, 0, 0)
  return d
}

function timeMonth (date: Date) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function timeYear (date: Date) {
  const d = new Date(date)
  d.setMonth(0)
  d.setHours(0, 0, 0, 0)
  return d
}

type Resolution = {
  symbol: string;
  formatPattern: string;
  searchPattern: RegExp;
  duration: number;
}

const resolution: Record<ResolutionLiteral, Resolution> = {
  tick: {
    symbol: 'L',
    formatPattern: 'S.L',
    searchPattern: /L+/g,
    duration: 1,
  },
  millisecond: {
    symbol: 'L',
    formatPattern: 'S.L',
    searchPattern: /L+/g,
    duration: 1,
  },
  second: {
    symbol: 'S',
    formatPattern: 'M:S',
    searchPattern: /S+/g,
    duration: durationSecond,
  },
  minute: {
    symbol: 'M',
    formatPattern: 'H:M',
    searchPattern: /M+/g,
    duration: durationMinute,
  },
  hour: {
    symbol: 'H',
    formatPattern: 'd/m H:M',
    searchPattern: /H+/g,
    duration: durationHour,
  },
  day: {
    symbol: 'd',
    formatPattern: 'd/m',
    searchPattern: /d+/g,
    duration: durationDay,
  },
  week: {
    symbol: 'w',
    formatPattern: 'd/m w',
    searchPattern: /w+/g,
    duration: durationWeek,
  },
  month: {
    symbol: 'm',
    formatPattern: 'm/y',
    searchPattern: /m+/g,
    duration: durationMonth,
  },
  year: {
    symbol: 'y',
    formatPattern: 'y',
    searchPattern: /y+/g,
    duration: durationYear,
  },
}

export const parseResolution = (date: Date): Resolution => {
  return (timeSecond(date) < +date ? resolution.millisecond
    : timeMinute(date) < +date ? resolution.second
      : timeHour(date) < +date ? resolution.minute
        : timeDay(date) < +date ? resolution.hour
          : timeMonth(date) < date ? (timeWeek(date) < date ? resolution.day : resolution.week)
            : timeYear(date) < date ? resolution.month
              : resolution.year)
}

export const timeFormat = (pattern: string) => {
  return (source: Date | string | number) => {
    const date = new Date(source)

    if (!date.getTime()) return source.toString()

    if (pattern === '') {
      pattern = parseResolution(date).formatPattern
    }

    return pattern
      .replace(resolution.millisecond.searchPattern, date.getMilliseconds().toString().padStart(3, '0'))
      .replace(resolution.second.searchPattern, date.getSeconds().toString().padStart(2, '0'))
      .replace(resolution.minute.searchPattern, date.getMinutes().toString().padStart(2, '0'))
      .replace(resolution.hour.searchPattern, date.getHours().toString().padStart(2, '0'))
      .replace(resolution.day.searchPattern, (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace(resolution.week.searchPattern, () => {
        const first_day_of_year = new Date(date.getFullYear(), 0, 1)
        const ms_diff = +date - +first_day_of_year
        const day_diff = ms_diff / durationDay
        return Math.ceil(day_diff / 7).toString()
      })
      .replace(resolution.month.searchPattern, date.getDate().toString().padStart(2, '0'))
      .replace(resolution.year.searchPattern, date.getFullYear().toString())
  }
}

export default timeFormat
