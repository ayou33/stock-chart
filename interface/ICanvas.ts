/**
 *  canvas通用接口抽象
 *  Shape.ts of project stock-chart
 *  @date 2022/7/25 17:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import LayoutCell from '../layout/LayoutCell'
import IRenderer from './IRenderer'

export type Bounding = { left: number, top: number }

interface ICanvas<E extends string = never> extends IRenderer<E> {
  container: LayoutCell;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  disabled: boolean;
  bounding: Bounding | null

  createBounding (el?: HTMLElement): Bounding

  pointer (x: number, y: number, el?: HTMLElement) : Vector

  render (): this;

  disable (hide?: boolean): this;

  /**
   * 取消禁止
   * @param show
   */
  enable (show?: boolean): this;

  /**
   * 绘制
   * @param update
   */
  draw (update: UpdatePayload): this;

  hide (): this;

  show (): this;

  remove (): this;

  /**
   * 清空画布
   */
  clear (): this;

  /**
   * 重设画布大小
   */
  resize (): this;
}

export default ICanvas
