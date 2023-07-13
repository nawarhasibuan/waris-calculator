# CalcWaris

Modules to calculate inheritance based on islamic belief.

#### contents

- [Quickstart](#quickstart)
  - [Installing](#installing)
  - [Example](#example)
- [Issue](#issue)
- [Licence](#licence)
- [Reference](#reference)

## Quickstart

### Installing

Using npm:

```bash
$ npm install waris-calculator
```

using yarn:

```bash
$ yarn add waris-calculator
```

### Example

```
import calculator, {Calculator, deceased, heir} from "calculator-waris";
import {HeirParams} from "calculator-waris/heir";

const calc = calculator()
//const calcFemale = calculator(deceased({gender: false}))

calc.push(heir({gender: false, relation: 'none', isPartner: true}))
calc.push(heir({gender: false, relation: 'child', isPartner: false}))
calc.push(heir({gender: true, relation: 'child', isPartner: false}))
calc.push(heir({gender: true, relation: 'sibling', isPartner: false}))

const result = calc.calculation
//result: Array<Fraction>, siham (shares) of heirs sequencially in push order
```

## Issue

Bug report and reach us [here](https://github.com/nawarhasibuan/waris-calculator/issues)

## LICENCE

MIT

## Reference

We use Ali, M. (2019). <i>Bagi Waris nggak harus Tragis.</i> Jakarta, Turos Khazanah Pustaka Islam, Indonesian translation for </br>
Ali, M. (2002). <i>Al-Mawaris fi Syari'ah al Islamiyyah fi Dhau' al-Kitab wa as-Sunah.</i> Kairo, Dar at-Taufiqiyah as reference. We prioritize majority opinion and mazhab syafii first.
