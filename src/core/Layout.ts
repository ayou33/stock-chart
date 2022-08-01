/**
 *  Layout.ts of project stock-chart
 *  @date 2022/8/1 17:15
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export type LayoutDimensions = {
}

class Layout {
  private readonly _el: HTMLTableElement
  private _diemnsions: DOMRect
  private _seriesWidth = 50
  private _axisHeight = 50

  constructor (dimensions: DOMRect) {
    this._diemnsions = dimensions
    this._el = document.createElement('table')

    this._el.innerHTML = `
      <tbody>
        <tr>
          <td class="series-container left"></td>
          <td class="chart-container"></td>
          <td class="series-container right"></td>
        </tr>
        <tr>
          <td class="placeholder"></td>
          <td class="main-axis"></td>
          <td class="placeholder"></td>
        </tr>
      </tbody>
    `
  }

  style (rect: DOMRect) {
    this._el.style.cssText = `
      width: ${rect.width}px;
      height: ${rect.height}px;
    `
  }

  node () {
    return this._el
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
    this._diemnsions = dimensions
  }
}

export default Layout
