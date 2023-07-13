import {heir} from "../src";

describe("heir test", () => {
  it("should throw error", () => {
    expect(() =>
      heir({gender: false, isPartner: true, relation: "child"})
    ).toThrow("mahram cant be a partner");
  });
  it("should throw err: setter", () => {
    const heirr = heir({gender: true, relation: "child"});
    heirr.isPartner = false;
    expect(heirr.isPartner).toBe(false);
    expect(() => (heirr.isPartner = true)).toThrow("mahram cant be a partner");
  });
  it("should throw err: setter relation", () => {
    const heirr = heir({
      gender: true,
      relation: "other",
      isPartner: true,
    });
    expect(() => (heirr.relation = "child")).toThrow(
      "mahram cant be a partner"
    );
    heirr.relation = "none";
    expect(heirr.relation).toBe("none");
  });
  it("should get property", () => {
    const heirr = heir({gender: true, relation: "cousin"});
    expect(heirr.power).toBe(3);
    expect(heirr.darajah).toBe(2);
    expect(heirr.relation).not.toBe("partner");
    heirr.gender = false;
    expect(heirr.code).toBe(40);
    expect(heir({gender: true, relation: "grand parent"}).code).toBe(11);
  });
});
