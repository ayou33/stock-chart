/**
 *  Shape.ts of project stock-chart
 *  @date 2022/7/25 17:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface IShape {
  points: Bar[];

  draw (): IShape;

  highlight (): IShape;

  focus (): IShape;

  remove (): IShape;
}

export default IShape
