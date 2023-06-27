import { Deceased } from "../src/core";

const deceased = new Deceased({gender: true})

describe('deceased test',()=>{
  it('should default estate',()=>{
    expect(deceased.estate).toBe(100)
  })
  it('should change estate',()=>{
    expect(()=>deceased.estate = 1000).not.toThrowError()
  })
  it('should estate changed',()=>{
    expect(deceased.estate).toBe(1000)
  })
  it('should check gender',()=>{
    expect(deceased.gender).toBe(true)
  })
})