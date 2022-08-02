/**
 *  Layout.ts of project stock-chart
 *  @date 2022/8/1 17:15
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Table from './Table'

export type LayoutDimensions = {
}

class Layout {
  private readonly _el: HTMLTableElement
  private readonly _table: Table
  private _dimensions: DOMRect
  private _seriesWidth = 50
  private _axisHeight = 50

  constructor (dimensions: DOMRect) {
    this._dimensions = dimensions

    this._el = document.createElement('table')

    this._el.style.borderCollapse = 'collapse'

    this._table = new Table(dimensions.width, dimensions.height, [
      [{}, { width: this._seriesWidth }],
      [{ height: this._axisHeight }, {}]
    ])

    this._el.appendChild(this._table.render())

    // this.style(this._dimensions)
  }

  style (dimensions: DOMRect) {
    this._dimensions = dimensions
  }

  node () {
    return this._el
  }

  chart () {
    return this._table.locate(0, 0)
  }

  mainAxis () {
    return this._el.querySelector('.main-axis')
  }

  series (selector?: string) {
    return this._el.querySelector(`.series-container${selector}`)
  }

  indicator () {
    return this._el.querySelector('.individual-indicator')
  }

  indicatorSeries (selector?: string) {
    return this._el.querySelector(`.indicator-series-container${selector}`)
  }

  resize (dimensions: DOMRect) {
    if (dimensions !== this._dimensions) {
      this._dimensions = dimensions
      this.style(this._dimensions)
    }
  }
}

export default Layout
