/**
 *  @file         src/layout/Layout.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:12
 *  @description
 */
import debounce from 'lodash.debounce'
import Event from '../base/Event'
import { CellDescriber } from './LayoutCell'
import LayoutRow, { RowDescriber } from './LayoutRow'

export type LayoutDescriber = Omit<RowDescriber, 'row'>[]

export type SpaceDescriber = {
  isSource: true;
  flexedWidth: boolean;
  width: number;
  flexedHeight: boolean;
  height: number;
  colSpan: number;
  rowSpan: number;
} | {
  isSource: false;
  ref: Vector;
}

export type Computer = {
  width: () => number;
  height: () => number;
}

class Layout extends Event<'resize'> {
  private readonly $table: HTMLTableElement
  private readonly _rows: LayoutRow[]
  private readonly _spaceDescriber: SpaceDescriber[][] = []
  private readonly _spaceComputer: Computer[][]
  private readonly _spaceSummary = {
    width: 0,
    height: 0,
    row: 0,
    column: 0,
  }

  constructor (root: Element, describer?: LayoutDescriber) {
    super()

    const rect = root.getBoundingClientRect()

    this._spaceSummary.width = rect.width
    this._spaceSummary.height = rect.height

    this.$table = this.createTable(rect.width, rect.height)

    const d = this.useDescriber(describer)

    this.initSpaceDescriber(d)

    this._rows = this.createRows(d)

    this._spaceComputer = this.buildSpaceComputer()

    root.appendChild(this.render())

    this.monitorResize(root)
  }

  private initSpaceDescriber (describer: LayoutDescriber) {
    describer.map((_, i) => this._spaceDescriber[i] = [])

    this._spaceSummary.row = describer.length

    if (this._spaceSummary.row !== 0) {
      this._spaceSummary.column = describer[0].cells.reduce((acc, v) => acc + (v?.colSpan ?? 1), 0)
    }
  }

  private createTable (width: number, height: number) {
    const table = document.createElement('table')

    table.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      border: none;
      border-collapse: collapse;
      border-spacing: 0;
    `

    return table
  }

  private useDescriber (describer?: LayoutDescriber) {
    return describer ?? [
      {
        name: 'chart_row',
        cells: [
          {
            name: 'main_chart_cell',
          },
          {
            name: 'default_series_cell', width: 60,
          },
        ],
      },
      {
        name: 'main_axis_row',
        height: 20,
        cells: [
          {
            name: 'main_axis_cell',
          },
          null,
        ],
      },
    ]
  }

  private createRows (describer: LayoutDescriber) {
    return describer.map((row, rowIndex) =>
      new LayoutRow(this, {
        ...row,
        row: rowIndex,
      }))
  }

  private monitorResize (root: Element) {
    window.addEventListener('resize', debounce(() => {
      this.resize(root.getBoundingClientRect())
    }, 1000 / 6))
  }

  private createWidthFormula (row: number, col: number) {
    const space = this._spaceDescriber[row][col]

    if (!space.isSource) return this._spaceComputer[space.ref[1]][space.ref[0]].width

    if (!space.flexedWidth) {
      return () => space.width
    }

    return () => {
      let fixedWidth = 0
      let fixedColumn = 0

      for (let i = 0, l = this._spaceDescriber[row].length; i < l; i++) {
        const space = this._spaceDescriber[row][i]
        if (!space.isSource) continue

        fixedWidth += space.flexedWidth ? 0 : space.width
        fixedColumn += space.flexedWidth ? 0 : space.colSpan
      }

      return (this._spaceSummary.width - fixedWidth) / (this._spaceSummary.column - fixedColumn) * space.colSpan
    }
  }

  private createHeightFormula (row: number, col: number) {
    const space = this._spaceDescriber[row][col]

    if (!space.isSource) return this._spaceComputer[space.ref[1]][space.ref[0]].height

    if (!space.flexedHeight) {
      return () => space.height
    }

    return () => {
      let fixedHeight = 0
      let fixedRow = 0

      for (let i = 0, l = this._spaceDescriber.length; i < l; i++) {
        const space = this._spaceDescriber[i][col]
        if (!space.isSource) continue

        fixedHeight += space.flexedHeight ? 0 : space.height
        fixedRow += space.flexedHeight ? 0 : space.rowSpan
      }

      return (this._spaceSummary.height - fixedHeight) / (this._spaceSummary.row - fixedRow) * space.rowSpan
    }
  }

  private buildSpaceComputer () {
    return this._spaceDescriber.map((r, ri) => r.map((_, ci) => {
      return {
        width: this.createWidthFormula(ri, ci),
        height: this.createHeightFormula(ri, ci),
      }
    }))
  }

  buildSpaceDescriber (row: number, col: number, describer: CellDescriber | null) {
    if (this._spaceDescriber[row][col]?.isSource === false) {
      return
    }

    const rs = describer?.rowSpan ?? 1
    const cs = describer?.colSpan ?? 1

    this._spaceDescriber[row][col] = {
      isSource: true,
      flexedHeight: describer?.height === undefined,
      height: describer?.height ?? 0,
      flexedWidth: describer?.width === undefined,
      width: describer?.width ?? 0,
      colSpan: cs,
      rowSpan: rs,
    }

    /**
     * expand row/column span
     */
    if (rs > 1 || cs > 1) {
      for (let r = row, rc = row + rs; r < rc; r++) {
        for (let c = col, cc = col + cs; c < cc; c++) {
          if (r === row && c === col) continue

          this._spaceDescriber[r][c] = {
            isSource: false,
            ref: [col, row],
          }
        }
      }
    }
  }

  render () {
    const fragment = document.createDocumentFragment()

    this._rows.map(r => fragment.appendChild(r.render()))

    this.$table.appendChild(fragment)

    return this.$table
  }

  locate (row: number, col: number) {
    return this._rows[row].at(col)
  }

  chart () {
    return this.locate(0, 0)
  }

  mainAxis () {
    return this.locate(1, 0)
  }

  series () {
    return this.locate(0, 1)
  }

  resize (rect: DOMRect) {
    this._spaceSummary.width = rect.width
    this._spaceSummary.height = rect.height

    this.$table.style.width = rect.width + 'px'
    this.$table.style.height = rect.height + 'px'

    console.log(this._spaceComputer[0][0].width(), this._spaceSummary)

    this.emit('resize')
  }

  appendRow () {
    return this
  }
}

export default Layout
