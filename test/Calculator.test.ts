import {Heir, Deceased, Calculator, Relation} from '../src'

const calc = new Calculator()
const calcF = new Calculator(new Deceased({gender: false}))
calcF.push(new Heir({gender: true, relation: Relation.none, isPartner: true}))

describe('test calculator class',()=>{
  it('should throw err push',()=>{
    expect(()=>calc.push(new Heir({gender: true, relation: Relation.none, isPartner: true}))).toThrow('LGBT is haram')
    expect(()=>calcF.push(new Heir({gender: true, relation: Relation.none, isPartner: true}))).toThrow(`Partner not allowed greater then ${calcF.partner}`)
  })
  it('should test remaining',()=>{
    calc.push(new Heir({gender: true, relation: Relation.grandParent}))
    calc.push(new Heir({gender: true, relation: Relation.sibling}))
    calc.push(new Heir({gender: true, relation: Relation.sibling}))
    calc.push(new Heir({gender: false, relation: Relation.sibling}))
    expect(calc.baseProblem).toBe(1)
    expect(calc.remaining === calc.baseProblem).toBe(true)
  })

})