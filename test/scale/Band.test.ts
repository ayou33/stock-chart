import Band from '../../src/scale/Band'


describe('', () => {
  const _band = new Band()
  _band.range([0, 100])
  
  test('paddingOuter', () => {
    expect(_band.paddingOuter(0)).toBe(0)
    expect(_band.paddingOuter(1)).toBe(0)
    expect(_band.paddingOuter(-1)).toBe(0)
    expect(_band.paddingOuter(2)).toBe(0)
    expect(_band.paddingOuter(0.5)).toBe(0.5)
  })

  test('paddingInner', () => {
    expect(_band.paddingInner(0)).toBe(0)
    expect(_band.paddingInner(1)).toBe(0)
    expect(_band.paddingInner(-1)).toBe(0)
    expect(_band.paddingInner(2)).toBe(0)
    expect(_band.paddingInner(0.5)).toBe(0.5)
  })

  test('padding', () => {
    expect(_band.padding(0)).toBe(0)
    expect(_band.padding(1)).toBe(0)
    expect(_band.padding(-1)).toBe(0)
    expect(_band.padding(2)).toBe(0)
    expect(_band.padding(0.5)).toBe(0.5)
  })

  test('align', () => {
    expect(_band.align(0)).toBe(0)
    expect(_band.align(1)).toBe(0)
    expect(_band.align(-1)).toBe(0)
    expect(_band.align(2)).toBe(0)
    expect(_band.align(0.5)).toBe(0.5)
  })

  test('alignValue', () => {
    expect(_band.alignValue(0)).toBe(0)
    expect(_band.alignValue(1)).toBe(0)
    expect(_band.alignValue(-1)).toBe(0)
    expect(_band.alignValue(2)).toBe(0)
    expect(_band.alignValue(0.5)).toBe(0.5)
  })

  test('value', () => {
    _band.domain([1,2,3,4,5,6,7,8,9,10])
    _band.align(0.5)
    _band.alignValue(0.5)
    _band.paddingInner(0.1)
    _band.paddingOuter(0.1)
    _band.bandWidth(8)

    expect(_band.value(-1)).toBe(NaN)
  })
})