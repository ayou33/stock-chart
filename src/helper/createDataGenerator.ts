/**
 *  createDataGenerator.ts of project stock-chart
 *  @date 2022/8/16 18:53
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { clone } from 'ramda'
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
      _bar.DT = new Date(time)

      const isCreate = time >= _next

      if (isCreate) {
        _next += _interval
        _bar.open = _bar.high = _bar.low = _bar.close
      }

      consume(clone(_bar), isCreate)
    }
  }

  function start(from: Bar, interval: number) {
    const preInterval = interval - from.date % interval

    _interval = interval
    _bar = clone(from)
    _next = from.date + preInterval

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
