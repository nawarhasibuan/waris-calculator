import {heir, relation} from "../src";

const Relation = relation();

describe("heir test", () => {
  it("should throw error", () => {
    expect(() =>
      heir({gender: false, isPartner: true, relation: Relation.child})
    ).toThrow("mahram cant be a partner");
  });
  it("should throw err: setter", () => {
    const heirr = heir({gender: true, relation: Relation.child});
    heirr.isPartner = false;
    expect(heirr.isPartner).toBe(false);
    expect(() => (heirr.isPartner = true)).toThrow("mahram cant be a partner");
  });
  it("should throw err: setter relation", () => {
    const heirr = heir({
      gender: true,
      relation: Relation.other,
      isPartner: true,
    });
    expect(() => (heirr.relation = Relation.child)).toThrow(
      "mahram cant be a partner"
    );
    heirr.relation = Relation.none;
    expect(heirr.relation).toBe(Relation.none);
  });
  it("should get property", () => {
    const heirr = heir({gender: true, relation: Relation.cousin});
    expect(heirr.power).toBe(3);
    expect(heirr.darajah).toBe(2);
    expect(heirr.relation).not.toBe(Relation.partner);
    heirr.gender = false;
    expect(heirr.code).toBe(40);
    expect(heir({gender: true, relation: Relation.grandParent}).code).toBe(11);
  });
});
