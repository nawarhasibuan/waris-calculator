# CalcWaris

Modules to calculate inheritance based on islamic belief.

## Reference

We use Ali, M. (2019). <i>Bagi Waris nggak harus Tragis.</i> Jakarta, Turos Khazanah Pustaka Islam, Indonesian translation for </br>
Ali, M. (2002). <i>Al-Mawaris fi Syari'ah al Islamiyyah fi Dhau' al-Kitab wa as-Sunah.</i> Kairo, Dar at-Taufiqiyah as reference. We prioritize majority opinion and mazhab syafii first.

## Installing

Using npm:

```bash
$ npm install waris-calculator
```

using yarn:

```bash
$ yarn add waris-calculator
```

## Example

```
import {Heir, Deceased, Calculator, Relation} from 'calculator-waris'
//const {Heir, Deceased, Calculator, Relation} = require('calculator-waris')


const calc = new Calculator()
//const calcFemale = new Calculator(new Deceased({gender: false}))

calc.push(new Heir({gender: false, relation: Relation.none, isPartner: true}))
calc.push(new Heir({gender: false, relation: Relation.child, isPartner: false}))
calc.push(new Heir({gender: true, relation: Relation.child, isPartner: false}))
calc.push(new Heir({gender: true, relation: Relation.sibling, isPartner: false}))

const result = calc.calculation
//result: Array<Fraction>, heir siham (shares) sequencially in push order
```

## Issue

Bug report and reach us <a hreff='https://github.com/nawarhasibuan/waris-calculator/issues'>here</a>

## LICENCE

MIT
