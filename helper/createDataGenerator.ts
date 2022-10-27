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
  let _nextPeriod = 0
  let _bar: null | Bar = null

  function push (time: number) {
    if (_bar) {
      const isCreate = time >= _nextPeriod

      while (time >= _nextPeriod) {
        _nextPeriod += _interval
      }

      const period = _nextPeriod - _interval

      consume({
         ..._bar ,
        date: period,
        DT: new Date(period),
      }, isCreate)

      if (isCreate) {
        _bar.open = _bar.high = _bar.low = _bar.close
      }
    }
  }

  function startTimer (preInterval: number) {
    _preTimer = window.setTimeout(() => {
      push(_nextPeriod)

      _timer = window.setInterval(() => {
        push(_nextPeriod)
      }, _interval)
    }, preInterval)
  }

  /**
   * 启动一个数据生成器
   * @param from
   * @param interval
   */
  function start (from: Bar, interval: number) {
    _interval = interval
    _bar = { ...from }
    _nextPeriod = from.date + _interval

    let preInterval = _interval

    if (from.date % _interval) {
      _nextPeriod = Math.floor(from.date / _interval) * _interval + interval
      preInterval = _nextPeriod - from.date
    }

    startTimer(preInterval)
  }

  /**
   * 在生成周期内插入数据
   * @param time
   * @param price
   */
  function insert (time: number, price: number) {
    if (_bar) {
      _bar.close = price
      _bar.high = Math.max(_bar.high, price)
      _bar.low = Math.min(_bar.low, price)

      stopTimer()

      push(time)

      startTimer(_nextPeriod - time)
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
