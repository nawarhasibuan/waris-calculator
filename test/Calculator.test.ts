import {heir, deceased, calculator, relation} from "../src";

const calc = calculator();
const calcF = calculator(deceased({gender: false}));
calcF.push(heir({gender: true, relation: relation().none, isPartner: true}));

describe("test calculator class", () => {
  it("should throw err push", () => {
    expect(() =>
      calc.push(
        heir({gender: true, relation: relation().none, isPartner: true})
      )
    ).toThrow("LGBT is haram");
    expect(() =>
      calcF.push(
        heir({gender: true, relation: relation().none, isPartner: true})
      )
    ).toThrow(`Partner not allowed greater then ${calcF.partner}`);
  });
  it("should test remaining", () => {
    calc.push(heir({gender: true, relation: relation().grandParent}));
    calc.push(heir({gender: true, relation: relation().sibling}));
    calc.push(heir({gender: true, relation: relation().sibling}));
    calc.push(heir({gender: false, relation: relation().sibling}));
    expect(calc.baseProblem).toBe(1);
    expect(calc.remaining === calc.baseProblem).toBe(true);
  });
});
