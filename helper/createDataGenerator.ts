/**
 *  createDataGenerator.ts of project stock-chart
 *  @date 2022/8/16 18:53
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { durationMinute } from './timeFormat'

export function createDataGenerator (consume: (bar: Bar, isCreate: boolean) => void) {
  let _interval = durationMinute
  let _preTimer = 0
  let _timer = 0
  let _next = 0
  let _bar: null | Bar = null

  function push (time: number) {
    if (_bar) {
      _bar.date = time

      const isCreate = time > _next

      while (time > _next) {
        _next += _interval
      }

      consume({
         ..._bar ,
        date: _next,
        DT: new Date(_next),
      }, isCreate)

      if (isCreate) {
        _bar.open = _bar.high = _bar.low = _bar.close
      }

    }
  }

  function start (from: Bar, interval: number) {
    _next = Math.ceil(from.date / interval) * interval
    _interval = interval
    _bar = { ...from }

    const preInterval = _next - from.date

    _preTimer = window.setTimeout(() => {
      push(_next)

      _timer = window.setInterval(() => {
        push(_next)
      }, _interval)
    }, preInterval)
  }

  function restart () {
    if (_bar) {
      stopTimer()
      start(_bar, _interval)
    }
  }

  function insert (time: number, price: number) {
    if (_bar) {
      _bar.close = price
      _bar.high = Math.max(_bar.high, price)
      _bar.low = Math.min(_bar.low, price)

      push(time)

      restart()
    }
  }

  function stopTimer () {
    clearTimeout(_preTimer)
    clearInterval(_timer)
  }

  function stop () {
    stopTimer()
    _bar = null
    _interval = durationMinute
  }

  return {
    insert,
    stop,
    start,
  }
}

export default createDataGenerator
