import calculator, {heir, deceased} from "../src";

const calc = calculator();
const calcF = calculator(deceased({gender: false}));
calcF.push(
  heir({
    gender: true,
    relation: "none",
    isPartner: true,
  })
);

describe("test calculator class", () => {
  it("should throw err push", () => {
    expect(() =>
      calc.push(heir({gender: true, relation: "cousin", isPartner: true}))
    ).toThrow("LGBT is haram");
    expect(() =>
      calcF.push(heir({gender: true, relation: "none", isPartner: true}))
    ).toThrow(`Partner not allowed greater then ${calcF.partner}`);
  });
  it("should test remaining", () => {
    calc.push(heir({gender: true, relation: "grand parent"}));
    calc.push(heir({gender: true, relation: "sibling"}));
    calc.push(heir({gender: true, relation: "sibling"}));
    calc.push(heir({gender: false, relation: "sibling"}));
    expect(calc.baseProblem).toBe(1);
    expect(calc.remaining === calc.baseProblem).toBe(true);
  });
});
