import { Relation } from '../src/assets'
import {Heir} from '../src/core'

describe('heir test',()=>{
  it('should throw error',()=>{
    expect(()=>new Heir({gender: false, isPartner: true, relation: Relation.child})).toThrow('mahram cant be a partner')
  })
  it('should throw err: setter',()=>{
    const heir: Heir = new Heir({gender: true, relation:Relation.child})
    heir.isPartner = false
    expect(heir.isPartner).toBe(false)
    expect(()=> heir.isPartner = true).toThrow('mahram cant be a partner')
  })
  it('should throw err: setter relation',()=>{
    const heir: Heir = new Heir({gender: true, relation:Relation.other, isPartner: true})
    expect(()=>heir.relation = Relation.child).toThrow('mahram cant be a partner')
    heir.relation= Relation.none
    expect(heir.relation).toBe(Relation.none)
  })
  it('should get property', ()=>{
    const heir = new Heir({ gender: true, relation: Relation.cousin})
    expect(heir.power).toBe(3)
    expect(heir.darajah).toBe(2)
    expect(heir.relation).not.toBe(Relation.partner)
    heir.gender = false
    expect(heir.code).toBe(40)
    expect(new Heir({gender: true, relation: Relation.grandParent}).code).toBe(11)
  })
})