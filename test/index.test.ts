import Fraction from "fraction.js";
import {calculator, deceased, heir, relation} from "../src";
import {Calculator} from "../src/calculator";

const Relation = relation();

type Data = {
  deceased: {gender: boolean};
  heirs: {gender: boolean; relation: string; isPartner?: boolean}[];
};

describe("normal case", () => {
  const _234: Data = {
    deceased: {gender: false},
    heirs: [
      {isPartner: true, gender: true, relation: Relation.none},
      {isPartner: false, gender: true, relation: Relation.siblingMother},
      {isPartner: false, gender: false, relation: Relation.parent},
      {isPartner: false, gender: true, relation: Relation.uncle},
    ],
  };

  it("should 234: ashabah got 0", () => {
    const calc = calculator(deceased(_234.deceased));
    _234.heirs.forEach((h) => {
      calc.push(heir(h));
    });
    expect(calc.baseProblem).toEqual(6);
    expect(calc.aul).toEqual(false);
    expect(calc.dzawilArham).toEqual(0);
    expect(calc.noFarun).toEqual(true);
    expect(calc.ashabah(3)).toEqual(true);
    expect(calc.share(2)).toStrictEqual(new Fraction(1 / 3));
    expect(calc.mahjub(1)).toEqual(false);
    expect(calc.ashabah(1)).toEqual(false);
    expect(calc.share(1)).toStrictEqual(new Fraction(1 / 6));
    expect(calc.remaining).toEqual(0 || -0);
    expect(calc.tashih).toEqual(6);
    expect(calc.calculation).toStrictEqual([
      new Fraction(1 / 2),
      new Fraction(1 / 6),
      new Fraction(1 / 3),
      new Fraction(0),
    ]);
  });

  it("should only: only wife", () => {
    const calc = calculator();
    calc.push(heir({gender: false, isPartner: true, relation: Relation.other}));
    calc.push(
      heir({gender: false, isPartner: false, relation: Relation.siblingMother})
    );
    calc.push(
      heir({gender: false, isPartner: false, relation: Relation.other})
    );

    expect(calc.radd).toBe(true);
    expect(calc.tashih).toBe(4);
    expect(calc.mahjub(0)).toBe(true);
    expect(calc.share(0)).toEqual(new Fraction(1 / 4));
    expect(calc.calculation).toEqual([
      new Fraction(1 / 4),
      new Fraction(3 / 4),
      new Fraction(0),
    ]);
  });
});

describe("umaratain case", () => {
  it("case 1: husband", () => {
    const calc = calculator(deceased({gender: false}));
    calc.push(heir({gender: true, relation: Relation.none, isPartner: true}));
    calc.push(
      heir({gender: true, relation: Relation.parent, isPartner: false})
    );
    calc.push(
      heir({gender: false, relation: Relation.parent, isPartner: false})
    );

    expect(calc.calculation).toEqual([
      new Fraction(1 / 2),
      new Fraction(2 / 6),
      new Fraction(1 / 6),
    ]);
  });
  it("case 2: wife", () => {
    const calc = calculator();
    calc.push(heir({gender: false, relation: Relation.none, isPartner: true}));
    calc.push(
      heir({gender: true, relation: Relation.parent, isPartner: false})
    );
    calc.push(
      heir({gender: false, relation: Relation.parent, isPartner: false})
    );

    expect(calc.calculation).toEqual([
      new Fraction(1 / 4),
      new Fraction(2 / 4),
      new Fraction(1 / 4),
    ]);
  });
});

describe("siblings case", () => {
  it("should akdariyah", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true}, //suami
        {gender: false, relation: Relation.parent, isPartner: false}, //ibu
        {gender: true, relation: Relation.grandParent, isPartner: false}, //kakek
        {gender: false, relation: Relation.sibling, isPartner: false}, //saudari
      ],
    };
    const calc = calculator(deceased(data.deceased));
    data.heirs.forEach((h) => {
      calc.push(heir(h));
    });

    const akdariyah =
      !calc.deceased.gender &&
      calc.partner > 0 &&
      calc.male(1, 1) === 1 &&
      calc.female(1, 0) === 1 &&
      calc.female(2, 0) === 1;
    expect(akdariyah).toBe(true);
    expect(calc.umaratain).toBe(false);
    expect(calc.radd).toBe(false);
    expect(calc.aul).toBe(true);
    // expect(calc.share(0)).toEqual(new Fraction(1/2))
    // expect(calc.share(1)).toEqual(new Fraction(1/3))
    // expect(calc.ashabah(2)).toBe(true)
    // expect(calc.share(3)).toEqual(new Fraction(1/2))
    // expect(calc.share(2)).toEqual(new Fraction(1/6))
    expect(calc.siblingCase).toBe(true);
    expect(calc.ashabah(2)).toBe(true);
    // expect(calc.calculation).toEqual([
    //   new Fraction(3/6),
    //   new Fraction(2/6),
    //   new Fraction(1/6),
    //   {d: 1, n: -0, s: 1},
    // ])
    expect(calc.calculation).toEqual([
      new Fraction(3 / 9),
      new Fraction(2 / 6),
      new Fraction(1 / 8),
      new Fraction(3 / 4),
    ]);
  });
  it("keadaan kedua: 180 muqasamah", () => {
    const _180: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: true, relation: Relation.grandParent, isPartner: false},
        {gender: true, relation: Relation.sibling, isPartner: false},
      ],
    };
    const calc = calculator(deceased(_180.deceased));
    _180.heirs.forEach((h) => {
      calc.push(heir(h));
    });

    expect(calc.siblingCase).toBe(true);
    expect(new Fraction(1 / 5).d).toBe(5);
    expect(calc.baseProblem).toBe(2);
    expect(calc.remaining).toBe(1);
    // expect(calc.tashih).toBe(4);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 2),
      new Fraction(1 / 4),
      new Fraction(1 / 4),
    ]);
  });

  it("should 181: 1/3 of rest", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.parent},
        {gender: true, relation: Relation.grandParent},
        {gender: true, relation: Relation.sibling},
        {gender: true, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 6),
      new Fraction(5 / 18),
      new Fraction((5 / 6) * (2 / 3) * (2 / 6)),
      new Fraction((5 / 6) * (2 / 3) * (2 / 6)),
      new Fraction((5 / 6) * (2 / 3) * (1 / 6)),
      new Fraction((5 / 6) * (2 / 3) * (1 / 6)),
    ]);
  });

  it("should 182: 1/6", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.child}, //daughtr
        {gender: false, relation: Relation.grandParent}, //grandma
        {gender: true, relation: Relation.grandParent}, //grandpa
        {gender: false, relation: Relation.sibling}, //sister
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.mahjub(4)).toBe(false);
    expect(calc.ashabah(4)).toBe(true);
    expect(calc.share(0)).toEqual(new Fraction(1 / 2));
    expect(calc.share(1)).toEqual(new Fraction(1 / 6));
    expect(calc.ashabah(2)).toBe(false);
    expect(calc.baseProblem).toBe(6);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 2),
      new Fraction(1 / 6),
      new Fraction(1 / 6),
      new Fraction(1 / 18),
      new Fraction(1 / 18),
      new Fraction(1 / 18),
    ]);
  });

  it("should sibling got nothing 183: 1/6 aul", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: true, relation: Relation.grandParent},
        {gender: true, relation: Relation.sibling},
        {gender: true, relation: Relation.sibling},
        {gender: true, relation: Relation.sibling},
        {gender: true, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.ashabah(6)).toBe(false);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 13),
      new Fraction(8 / (13 * 5)),
      new Fraction(8 / (13 * 5)),
      new Fraction(8 / (13 * 5)),
      new Fraction(8 / (13 * 5)),
      new Fraction(8 / (13 * 5)),
      new Fraction(2 / 13),
      new Fraction(0),
      new Fraction(0),
      new Fraction(0),
      new Fraction(0),
    ]);
  });

  it("should sibling got nothing 184: 1/6 aul", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.grandChild},
        {gender: false, relation: Relation.parent},
        {gender: true, relation: Relation.grandParent},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.ashabah(5)).toBe(false);
    expect(calc.calculation).toEqual([
      new Fraction(3 / (27 * 2)),
      new Fraction(3 / (27 * 2)),
      new Fraction(12 / 27),
      new Fraction(4 / 27),
      new Fraction(4 / 27),
      new Fraction(4 / 27),
      new Fraction(0),
      new Fraction(0),
      new Fraction(0),
    ]);
  });

  it("should blocked 185: 1/6 aul", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.parent},
        {gender: true, relation: Relation.grandParent},
        {gender: true, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.siblingCase).toBe(true);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 15),
      new Fraction(2 / 15),
      new Fraction(2 / 15),
      new Fraction(2 / 15),
      new Fraction(2 / 15),
      new Fraction(2 / 15),
      new Fraction(2 / 15),
      new Fraction(0),
      new Fraction(0),
    ]);
  });

  it("should brother and brother in father 188: 1/3", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: true, relation: Relation.grandParent},
        {gender: true, relation: Relation.sibling},
        {gender: true, relation: Relation.siblingFather},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 3),
      new Fraction(2 / 3),
      new Fraction(0),
    ]);
  });

  it("should saudara pr kandung dan saudara seayah 189: 1/3", () => {
    //sisters share not subtructed

    const _189: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: false, relation: Relation.sibling, isPartner: false}, //saudara pr
        {gender: true, relation: Relation.grandParent, isPartner: false}, //kakek
        {gender: true, relation: Relation.siblingFather, isPartner: false}, //sauarada seayah lk
        {gender: false, relation: Relation.siblingFather, isPartner: false}, // "" pr
        {gender: false, relation: Relation.siblingFather, isPartner: false}, //""""
      ],
    };
    const calc = calculator(deceased(_189.deceased));
    _189.heirs.forEach((h) => {
      calc.push(heir(h));
    });

    expect(calc.siblingCase).toBe(true);
    expect(calc.ashabah(0)).toBe(false);
    expect(calc.mahjub(0)).toBe(false);
    // expect(calc.mahjub(2)).toBe(false);
    // expect(calc.ashabah(3)).toBe(true);
    // expect(calc.baseProblem).toBe(2);
    // expect(calc.remaining).toBe(1);
    // expect(calc.share(0)).toEqual(new Fraction(1/2));
    expect(calc.calculation).toEqual([
      new Fraction(1 / 2),
      new Fraction(1 / 3),
      new Fraction(1 / 12),
      new Fraction(1 / 24),
      new Fraction(1 / 24),
    ]);
  });

  it("should 190: muqasamah", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: false, relation: Relation.parent},
        {gender: true, relation: Relation.grandParent},
        {gender: true, relation: Relation.sibling},
        {gender: false, relation: Relation.siblingFather},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 6),
      new Fraction(1 / 3),
      new Fraction(1 / 2),
      new Fraction(0),
    ]);
  });

  it("should 191: 1/3 rest", () => {
    //sisters share not subtructed
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: false, relation: Relation.parent},
        {gender: true, relation: Relation.grandParent},
        {gender: false, relation: Relation.sibling},
        {gender: true, relation: Relation.siblingFather},
        {gender: true, relation: Relation.siblingFather},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 6),
      new Fraction(10 / 36),
      new Fraction(1 / 2),
      new Fraction(1 / 36),
      new Fraction(1 / 36),
    ]);
  });
});

describe("radd case", () => {
  it("should 4th case 225: there's partner, differ share", () => {
    const _225: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.grandParent, isPartner: false},
        {gender: false, relation: Relation.siblingMother, isPartner: false},
        {gender: false, relation: Relation.siblingMother, isPartner: false},
      ],
    };
    const calc = calculator(deceased(_225.deceased));
    _225.heirs.forEach((h) => {
      calc.push(heir(h));
    });
    expect(calc.calculation).toEqual([
      new Fraction(1 / 4),
      new Fraction(1 / 4),
      new Fraction(1 / 4),
      new Fraction(1 / 4),
    ]);
  });
  it("should 3rd case 222: there's partner, same share", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 4),
      new Fraction(3 / 8),
      new Fraction(3 / 8),
    ]);
  });
  it("should 2nd case 221.1: no partner differ share", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.grandChild},
      ],
    };
    const calc = calculator(deceased(data.deceased));
    data.heirs.forEach((h) => {
      calc.push(heir(h));
    });

    expect(calc.tashih).toBe(4);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 4),
      new Fraction(1 / 4),
    ]);
  });
  it("should 2nd 221.5: no partner differ share", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.siblingMother},
        {gender: false, relation: Relation.siblingFather},
      ],
    };
    const calc = calculator(deceased(data.deceased));
    data.heirs.forEach((h) => {
      calc.push(heir(h));
    });

    expect(calc.tashih).toBe(5);
    // expect(calc.calculation).toEqual([
    //   new Fraction(3/4),
    //   new Fraction(1/4),
    // ])
  });
  it("should 1st case: no partner, same share", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 4),
      new Fraction(1 / 4),
      new Fraction(1 / 4),
      new Fraction(1 / 4),
    ]);
  });
});

describe("aul case", () => {
  it("should 206.1: normal", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.parent},
        {gender: false, relation: Relation.parent},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.grandChild},
      ],
    };
    const calc = add(data);
    let x: Fraction = new Fraction(1 / 2);
    x = x.add(1 / 2);
    expect(x).toEqual(new Fraction(1));
    expect(calc.calculation).toEqual([
      new Fraction(1 / 6),
      new Fraction(1 / 6),
      new Fraction(3 / 6),
      new Fraction(1 / 6),
    ]);
  });

  it("should 206.2: 6 to 7", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.siblingMother},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 7),
      new Fraction(3 / 7),
      new Fraction(1 / 7),
    ]);
  });

  it("should 206.3: mahabalah", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.parent},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.siblingMother},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 8),
      new Fraction(1 / 8),
      new Fraction(3 / 8),
      new Fraction(1 / 8),
    ]);
  });

  it("should 207.4: marwaniyah", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: true, relation: Relation.siblingMother},
        {gender: true, relation: Relation.siblingMother},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
      ],
    };
    const calc = add(data);
    expect(calc.aul).toBe(true);
    expect(calc.radd).toBe(false);
    expect(calc.female(2, 2)).toBe(2);
    expect(calc.share(1)).toEqual(new Fraction(1 / 3));
    expect(calc.share(3)).toEqual(new Fraction(2 / 3));
    expect(calc.baseProblem).toBe(6);
    expect(calc.umaratain).toBe(false);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 9),
      new Fraction(1 / 9),
      new Fraction(1 / 9),
      new Fraction(2 / 9),
      new Fraction(2 / 9),
    ]);
  });

  it("should 206.5: syuraihiyah", () => {
    const data: Data = {
      deceased: {gender: false},
      heirs: [
        {gender: true, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingMother},
        {gender: false, relation: Relation.siblingMother},
        {gender: false, relation: Relation.parent},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 10),
      new Fraction(2 / 10),
      new Fraction(2 / 10),
      new Fraction(1 / 10),
      new Fraction(1 / 10),
      new Fraction(1 / 10),
    ]);
  });

  it("should 209: 12 to 13", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.parent},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 13),
      new Fraction(4 / 13),
      new Fraction(4 / 13),
      new Fraction(2 / 13),
    ]);
  });

  it("should 210: 12 to 15", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.parent},
        {gender: false, relation: Relation.sibling},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingMother},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(3 / 15),
      new Fraction(2 / 15),
      new Fraction(6 / 15),
      new Fraction(2 / 15),
      new Fraction(2 / 15),
    ]);
  });

  it("should 211: 12 to 17", () => {
    const data: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: false, relation: Relation.grandParent},
        {gender: false, relation: Relation.grandParent},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingFather},
        {gender: false, relation: Relation.siblingMother},
        {gender: false, relation: Relation.siblingMother},
        {gender: false, relation: Relation.siblingMother},
        {gender: false, relation: Relation.siblingMother},
      ],
    };
    const calc = add(data);
    expect(calc.calculation).toEqual([
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
      new Fraction(1 / 17),
    ]);
  });

  it("should 212: 24 to 27 minbariyah", () => {
    const _225: Data = {
      deceased: {gender: true},
      heirs: [
        {gender: false, relation: Relation.none, isPartner: true},
        {gender: true, relation: Relation.parent},
        {gender: false, relation: Relation.parent},
        {gender: false, relation: Relation.child},
        {gender: false, relation: Relation.child},
      ],
    };
    const calc = calculator(deceased(_225.deceased));
    _225.heirs.forEach((h) => {
      calc.push(heir(h));
    });
    expect(calc.ashabah(1)).toBe(false);
    expect(calc.share(1)).toEqual(new Fraction(1 / 6));
    expect(calc.tashih).toBe(27);
  });
});

function add(data: Data): Calculator {
  const calc = calculator(deceased(data.deceased));
  data.heirs.forEach((h) => {
    calc.push(heir(h));
  });
  return calc;
}
