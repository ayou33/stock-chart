/**
 *  坐标轴抽象
 *  IAxis.ts of project stock-chart
 *  @date 2022/8/4 15:50
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import ICanvas from './ICanvas'

interface IAxis<T = Extent> extends ICanvas {
  /**
   * 输出范围
   * @param range
   */
  range (range?: Extent): Extent;

  /**
   * 输入范围
   * @param domain
   */
  domain (domain?: T): T;

  /**
   * 获取输出
   * @param domainValue
   * @param align
   */
  value (domainValue: number, align?: number): number;

  /**
   * 反向求值
   * @param rangeValue
   */
  invert (rangeValue: number): number;

  /**
   * range变换
   * @param transform
   * @param ref
   */
  transform (transform: Transform, ref?: number): this;

  /**
   * 标记指定的range
   * @param position
   */
  focus (position: number): this;

  /**
   * 取消标记指定位置
   */
  blur (): this;

  /**
   * 设置刻度间隙
   * @param interval
   */
  ticks (interval: number): this;

  /**
   * 刻度显示格式化
   * @param format
   */
  tickFormat (format: (value: number, pos: number) => string): this;
}

export default IAxis
