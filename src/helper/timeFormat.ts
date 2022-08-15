/**
 *  timeFormat.ts of project stock-chart
 *  @date 2022/8/15 11:37
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export const durationSecond = 1000,
  durationMinute = durationSecond * 60,
  durationHour = durationMinute * 60,
  durationDay = durationHour * 24,
  durationWeek = durationDay * 7,
  durationMonth = durationDay * 30,
  durationYear = durationDay * 365

export const spec_millisecond = 'L',
  spec_second = 'S',
  spec_minute = 'M',
  spec_hour = 'H',
  spec_day = 'd',
  spec_week = 'w',
  spec_month = 'm',
  spec_year = 'y'

export const formatMillisecond = '.L',
  formatSecond = 'M:S',
  formatMinute = 'H:M',
  formatHour = 'd/m H:M',
  formatDay = 'd/m',
  formatWeek = 'd/m',
  formatMonth = 'm',
  formatYear = 'y'

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

function multiFormat (date: Date) {
  return (timeSecond(date) < +date ? formatMillisecond
    : timeMinute(date) < +date ? formatSecond
      : timeHour(date) < +date ? formatMinute
        : timeDay(date) < +date ? formatHour
          : timeMonth(date) < date ? (timeWeek(date) < date ? formatDay : formatWeek)
            : timeYear(date) < date ? formatMonth
              : formatYear)
}

export const timeFormat = (pattern: string) => {
  return (source: Date | string | number) => {
    const date = new Date(source)

    if (!date.getTime()) return source.toString()

    if (pattern === '') {
      pattern = multiFormat(date)
    }

    return pattern
      .replace(/L+/g, date.getMilliseconds().toString().padStart(3, '0'))
      .replace(/S+/g, date.getSeconds().toString().padStart(2, '0'))
      .replace(/H+/g, date.getHours().toString().padStart(2, '0'))
      .replace(/M+/g, date.getMinutes().toString().padStart(2, '0'))
      .replace(/m+/g, (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace(/d+/g, date.getDate().toString().padStart(2, '0'))
      .replace(/y+/g, date.getFullYear().toString())
  }
}

export default timeFormat
