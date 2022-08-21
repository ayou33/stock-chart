/**
 *  Layout.ts of project stock-chart
 *  @date 2022/8/1 17:15
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import LayoutTable from './LayoutTable'

class Layout {
  private readonly _el: HTMLTableElement
  private readonly _table: LayoutTable
  private _dimensions: DOMRect
  private _seriesWidth = 60
  private _axisHeight = 20

  constructor (dimensions: DOMRect) {
    this._dimensions = dimensions

    this._el = document.createElement('table')

    this._el.style.cssText = `
      border: none;
      border-collapse: collapse;
      border-spacing: 0;
    `

    this._table = new LayoutTable(dimensions.width, dimensions.height, [
      [{}, { width: this._seriesWidth }],
      [{ height: this._axisHeight }, {}]
    ])

    this._el.appendChild(this._table.render())
  }

  node () {
    return this._el
  }

  chart () {
    return this._table.locate(0, 0)
  }

  mainAxis () {
    return this._table.locate(1, 0)
  }

  series () {
    return this._table.locate(0, 1)
  }

  resize (dimensions: DOMRect) {
    if (dimensions !== this._dimensions) {
      this._dimensions = dimensions
      this._table.resize(this._dimensions.width, this._dimensions.height)
    }
  }
}

export default Layout
