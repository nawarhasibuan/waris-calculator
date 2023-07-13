import deceased, {Deceased} from "./deceased";
import error from "./error";
import heir, {Heir} from "./heir";
import Fraction from "fraction.js";

/**
 * Create calculator
 * @param d Deceased
 * @returns Calculator
 */
export default function calculator(d?: Deceased) {
  return new Calculator(d);
}

export {deceased, heir, Calculator};

/**
 *
 * This class offer a capability to calculate division of inheritance based on Islam.
 * Use the majority opinion of ulama as reference.
 *
 * @author Panawar Hasibuan
 * @email panawarhsb28@gmail.com
 * @reference Ali, M. (2019). Bagi Waris nggak harus Tragis. Jakarta, Turos Khazanah Pustaka Islam.
 * @original Ali, M. (2002). Al-Mawaris fi Syari'ah al Islamiyyah fi Dhau' al-Kitab wa as-Sunah. Kairo, Dar at-Taufiqiyah
 */
class Calculator {
  /**
   * matrix store male heirs
   */
  private men: Array<Array<number>>;

  /**
   * matrix stor female heirs
   */
  private women: Array<Array<number>>;

  private _deceased: Deceased;

  /**
   * Array of heir
   */
  private heirs: Array<Heir>;

  /**
   * Constructor of Calculator
   *
   * @param deceased deceased of this calculator
   * @default deceased Deceased({gender: true, estate: 100})
   */
  constructor(deceased?: Deceased) {
    this.men = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.women = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.heirs = [];
    if (deceased) {
      this._deceased = deceased;
    } else {
      this._deceased = new Deceased({gender: true});
    }
  }

  /**
   * deceased setter
   */
  public set deceased(deceased: Deceased) {
    if (this.partner > 0) {
      const heir: Heir =
        this.heirs.find((heir) => heir.isPartner) ||
        new Heir({
          gender: !deceased.gender,
          isPartner: true,
          relation: "none",
        });
      if (deceased.gender === heir.gender) {
        throw error("deceased and partner shouldn't have same gender")
          .decErr()
          .push({gender: "not allowed same with partner gender"});
      }
    }
    this._deceased = deceased;
  }

  /**
   * deceased getter
   */
  public get deceased(): Deceased {
    return this._deceased;
  }

  /**
   * number of partner
   */
  public get partner(): number {
    return this.heirs.filter((h) => h.isPartner).length;
  }

  /**
   * number of liberator
   */
  public get liberator(): number {
    return this.heirs.filter((h) => h.relation === "liberator").length;
  }

  /**
   * number of heir with dzawil arham relation
   */
  public get dzawilArham(): number {
    return this.heirs.filter((h) => h.power === 4 && h.darajah === 0).length;
  }

  /**
   * base problem
   */
  public get baseProblem(): number {
    let saham = new Fraction(1);
    for (let idx = 0; idx < this.heirs.length; idx++) {
      saham = saham.lcm(this.share(idx).d);
    }
    return this.umaratain ? saham.n / 3 : saham.n;
  }

  /**
   * final base problem
   */
  public get tashih(): number {
    //stonks cause of aul or radd
    let x = new Fraction(1);
    const saham = this.calculation;
    saham.forEach((siham) => {
      x = x.lcm(siham.d);
    });
    return x.n;
  }

  /**
   * ashabah portion, number of siham after ahlul furud take theirs
   */
  public get remaining(): number {
    let saham = new Fraction(0);
    for (let i = 0; i < this.heirs.length; i++) {
      saham = saham.add(this.share(i).div(this.friends(i)));
    }
    return saham.sub(1).mul(-this.baseProblem).valueOf();
  }

  /**
   * is the base problem increase because sum protion of ahlul furud greater then the inheritance
   */
  public get aul(): boolean {
    return this.remaining < 0;
  }

  /**
   * absence of ashabah but inheritance still remaining so base problem decreas
   */
  public get radd(): boolean {
    return (
      this.remaining > 0 && this.noAshabah && this.remaining < this.baseProblem
    );
  }

  /**
   * is brothers and sisters with grand father
   */
  public get siblingCase(): boolean {
    return (
      this.noBoy &&
      this.male(1, 0) === 0 &&
      !this.noAshlun &&
      this.male(2, 0) +
        this.male(2, 1) +
        this.female(2, 0) +
        this.female(2, 1) >
        0
    );
  }

  /**
   * Case of umaratain, when mother got 1/3 with father ashabah and there is/are partner(s).
   * Mother got more than father and this is not the inheritance concept, so mother got 1/3 of the remaining after partner take his/her.
   * This make father (male) got 2 times mother (female) portion
   */
  public get umaratain(): boolean {
    let siblings = 0;
    this.men[2].forEach((sibling) => {
      siblings += sibling;
    });
    this.women[2].forEach((sibling) => {
      siblings += sibling;
    });
    return (
      this.noFarun &&
      siblings < 2 &&
      this.partner > 0 &&
      this.male(1, 0) * this.female(1, 0) +
        this.male(1, 1) * this.female(1, 1) +
        this.male(1, 2) * this.female(1, 2) >
        0
    );
  }

  /**
   * absence of descendants
   */
  public get noFarun(): boolean {
    return this.noBoy && this.women[0].every((child) => child === 0);
  }

  /**
   * absence of male descendants
   */
  public get noBoy(): boolean {
    return this.men[0].every((boy) => boy === 0);
  }

  /**
   * absence of parent
   */
  public get noAshlun(): boolean {
    return this.men[1].every((father) => father === 0);
  }

  /**
   * absence of parent and descendants
   */
  public get kalalah(): boolean {
    return this.noFarun && this.noAshlun;
  }

  /**
   * absence of ashabah
   */
  public get noAshabah(): boolean {
    let found = false;
    let i = 0;
    do {
      found = !this.men[i].every((heir) => heir === 0);
      i++;
    } while (!found && i < this.men.length);
    return (
      !found && (this.kalalah || this.female(2, 0) + this.female(2, 1) === 0)
    );
  }

  /**
   * absence of female heir
   */
  public get noWomen(): boolean {
    let found = false;
    let i = 0;
    do {
      found = !this.women[i].every((heir) => heir === 0);
      i++;
    } while (!found);
    return !found;
  }

  /**
   * share calculation
   */
  public get calculation(): Array<Fraction> {
    let saham: Array<Fraction> = [];
    //ahlul furud
    if (this.umaratain) {
      const partnerIdx = this.heirs.findIndex((heir) => heir.isPartner);
      const remain = this.share(partnerIdx).sub(1).mul(-1);
      this.heirs.forEach((heir, idx) => {
        if (heir.isPartner || heir.power !== 1) {
          saham[idx] = this.share(idx).div(this.friends(idx));
        } else {
          saham[idx] = this.mahjub(idx)
            ? this.share(idx)
            : heir.gender
            ? remain.mul(2 / 3)
            : remain.mul(1 / 3);
        }
      });
    } else if (this.siblingCase) {
      /**
       * akdariyah
       */
      const akdariyah: boolean =
        !this.deceased.gender &&
        this.partner > 0 &&
        this.male(1, 1) === 1 &&
        this.female(1, 0) === 1 &&
        this.female(2, 0) === 1 &&
        this.heirs.length === 4;
      if (akdariyah) {
        this.heirs.forEach((heir, idx) => {
          if (heir.isPartner) {
            saham[idx] = new Fraction(1 / 3);
          } else if (heir.power === 1) {
            saham[idx] = heir.gender
              ? new Fraction(1 / 8)
              : new Fraction(1 / 3);
          } else {
            saham[idx] = new Fraction(3 / 4);
          }
        });
        return saham;
      }
      /**
       * grand father share for this case
       * @ -1 for one third (1/3)
       * @ 0 for one shixth (1/6)
       * @ 1 for muqasamah
       *
       * logic behind
       * @ m > 3; m>6 ? 1 : 0
       * @ m < 3; m>6 : -1
       * @ m < 3; m<6; cek 3>6? -1:0
       */
      let grandPa: number = 0;
      const oneSixth = new Fraction(1 / 6);
      const muqasamah = new Fraction(
        2 /
          (2 * this.male(1, 1) +
            2 * this.male(2, 0) +
            2 * this.male(2, 1) +
            this.female(2, 0) +
            this.female(2, 1))
      );
      let remainingNoSibling: Fraction = new Fraction(0);
      this.heirs.forEach((heir, idx) => {
        //sister and grand father exclude
        remainingNoSibling =
          ((heir.code === 20 || heir.code === 21) && !heir.gender) ||
          (heir.code === 11 && heir.gender)
            ? remainingNoSibling
            : remainingNoSibling.add(this.share(idx));
      });
      remainingNoSibling = new Fraction(1).sub(remainingNoSibling);
      grandPa =
        muqasamah.mul(remainingNoSibling).compare(remainingNoSibling.div(3)) > 0
          ? muqasamah.mul(remainingNoSibling).compare(1 / 6) > 0
            ? 1
            : 0
          : muqasamah.mul(remainingNoSibling).compare(1 / 6) > 0
          ? -1
          : oneSixth.compare(remainingNoSibling.div(3)) > 0
          ? 0
          : -1;

      /**
       * grandpa share
       */
      const grandShare: Fraction =
        grandPa > 0
          ? muqasamah.mul(remainingNoSibling)
          : grandPa < 0
          ? new Fraction(1 / 3).mul(remainingNoSibling)
          : new Fraction(1 / 6);

      let rest: Fraction = remainingNoSibling.sub(grandShare);
      /**
       * is aul in sibling case
       */
      const aulSibling: boolean = rest.compare(0) < 1;

      if (aulSibling) {
        let sum = new Fraction(0);
        let lcm = new Fraction(1);
        this.heirs.forEach((heir, idx) => {
          sum =
            heir.code === 11 && heir.gender
              ? sum.add(grandShare)
              : sum.add(this.share(idx).div(this.friends(idx)));
          lcm =
            heir.code === 11
              ? lcm.lcm(grandShare.d)
              : lcm.lcm(this.share(idx).d);
        });
        const newProb = sum.mul(lcm.n);
        this.heirs.forEach((heir, idx) => {
          saham[idx] = this.share(idx)
            .mul(lcm.n / this.friends(idx))
            .div(newProb);
        });
      } else {
        let sister: Fraction = new Fraction(0);
        this.heirs.forEach((heir, idx) => {
          sister =
            (heir.code === 20 || heir.code === 21) && !heir.gender
              ? sister.add(this.share(idx))
              : sister;
        });
        rest = rest.sub(sister);
        this.heirs.forEach((heir, idx) => {
          if (heir.power === 1 && heir.darajah > 0 && heir.gender) {
            saham[idx] = grandShare;
          } else {
            if (this.ashabah(idx)) {
              let a = heir.gender ? 2 : 1;
              let b = heir.gender ? 1 : 2;
              let siblings = a * this.friends(idx) + b * this.siblings(idx);
              saham[idx] = heir.gender
                ? rest.mul(2 / siblings)
                : rest.div(siblings);
            } else {
              saham[idx] = this.share(idx).div(this.friends(idx));
            }
          }
        });
      }
    } else if (this.radd) {
      let newProb = new Fraction(1);
      let sum = new Fraction(0);
      // count the decrease of base prob
      this.heirs.forEach((heir, idx) => {
        if (!heir.isPartner) {
          newProb = newProb.lcm(this.share(idx).d);
          sum = sum.add(this.share(idx).div(this.friends(idx)));
        }
      });
      //add remainder to heirs except partner non dzawil arham
      this.heirs.forEach((heir, idx) => {
        //partner non rahmi (dzawil arham) or there's other family
        if (this.mahjub(idx)) {
          saham[idx] = this.share(idx).div(this.friends(idx));
        } else {
          /**
           * saham = furud + furud*sisa (sisa in /baseProblem)
           */
          let n = newProb.n > 0 ? newProb.n : 1;
          if (heir.isPartner) {
            saham[idx] = this.share(idx)
              .div(this.friends(idx))
              .add(this.remaining / (this.baseProblem * this.dzawilArham));
          } else if (heir.power < 3) {
            //child, parent, sibling
            saham[idx] = this.share(idx)
              .add(
                this.share(idx)
                  .mul(n)
                  .div(sum.mul(n))
                  .mul(this.remaining / this.baseProblem)
              )
              .div(this.friends(idx));
          } else {
            // rahmi: share + sisa/(base * friends)
            saham[idx] = this.share(idx).add(
              this.remaining / (this.friends(idx) * this.baseProblem)
            );
          }
        }
      });
    } else if (this.aul) {
      let sum = new Fraction(0);
      this.heirs.forEach((heir, idx) => {
        sum = sum.add(this.share(idx).div(this.friends(idx)));
      });
      const newProb = sum.mul(this.baseProblem);
      this.heirs.forEach((heir, idx) => {
        saham[idx] = this.share(idx)
          .mul(this.baseProblem / this.friends(idx))
          .div(newProb);
      });
    } else {
      //normal case
      this.heirs.forEach((heir, idx) => {
        if (this.ashabah(idx)) {
          //ashabah
          let a = heir.gender ? 2 : 1;
          let b = heir.gender ? 1 : 2;
          let siblings = a * this.friends(idx) + b * this.siblings(idx);
          saham[idx] = heir.gender
            ? new Fraction(this.remaining / this.baseProblem).mul(2 / siblings)
            : new Fraction(this.remaining / this.baseProblem).div(siblings);
        } else {
          //others
          saham[idx] = this.share(idx).div(this.friends(idx));
        }
      });
    }
    return saham;
  }

  /**
   * push a heir to this.heirs
   * @param heir heir to add
   * @returns this calculator
   * @throws WarisError
   */
  public push(heir: Heir) {
    if (heir.isPartner) {
      if (heir.gender === this.deceased.gender) {
        throw error(`LGBT is haram`)
          .heirErr()
          .push({gender: "not allowed same gender with deceased"});
      }
      if (
        (this.deceased.gender && this.partner > 4) ||
        (!this.deceased.gender && this.partner > 0)
      ) {
        throw error(`Partner not allowed greater then ${this.partner}`)
          .heirErr()
          .push({isPartner: "partner number has reached the limit"});
      }
    }
    if (heir.power > 3 && heir.darajah > 3) {
      throw error("Not a heir")
        .heirErr()
        .push({relation: "not valid to accept shares"});
    }
    if (
      heir.power === 1 &&
      heir.darajah === 0 &&
      (heir.gender ? this.male(1, 0) : this.female(1, 0)) > 0
    ) {
      throw error(
        `deceased only has 1 (one) ${heir.gender ? "father" : "mother"}.`
      )
        .heirErr()
        .push({relation: "number of parent limted"});
    }
    if (heir.power === 2) {
      if (heir.darajah === 2) {
        this.increament(heir.power, heir.darajah, false);
      } else if (heir.darajah > 2) {
        let x = heir.gender ? heir.darajah - 1 : heir.darajah;
        this.increament(heir.power, x, heir.gender);
      } else {
        this.increament(heir.power, heir.darajah, heir.gender);
      }
    } else if (heir.power < 4) {
      this.increament(heir.power, heir.darajah, heir.gender);
    }
    this.heirs.push(heir);
    return this;
  }

  /**
   * pop a heir from this.heirs
   */
  public pop(): Heir | undefined {
    const heir = this.heirs.pop();
    if (heir !== undefined) {
      if (heir.power === 2) {
        if (heir.darajah === 2) {
          this.decreament(heir.power, heir.darajah, false);
        } else if (heir.darajah > 2) {
          let x = heir.gender ? heir.darajah - 1 : heir.darajah;
          this.decreament(heir.power, x, heir.gender);
        } else {
          this.decreament(heir.power, heir.darajah, heir.gender);
        }
      } else if (heir.power > -1) {
        this.decreament(heir.power, heir.darajah, heir.gender);
      }
    }
    return heir;
  }

  /**
   * delete a heir from this.heirs if exist
   *
   * @param idx index of heir to delete
   * @returns deleted heir if exist
   */
  public delete(idx: number): Heir | undefined {
    const heir = this.heirs.splice(idx, 1)[0];
    if (heir !== undefined) {
      if (heir.power === 2) {
        if (heir.darajah === 2) {
          this.decreament(heir.power, heir.darajah, false);
        } else if (heir.darajah > 2) {
          let x = heir.gender ? heir.darajah - 1 : heir.darajah;
          this.decreament(heir.power, x, heir.gender);
        } else {
          this.decreament(heir.power, heir.darajah, heir.gender);
        }
      } else if (heir.power < 4) {
        this.decreament(heir.power, heir.darajah, heir.gender);
      }
    }
    return heir;
  }

  /**
   * clear this.heirs, set to []
   */
  public clear() {
    this.heirs = [];
    this.men = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.women = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  /**
   * get specific heir
   * @param idx index in heirs
   * @returns copy of heir
   */
  public heir(idx: number): Heir {
    return new Heir({
      gender: this.heirs[idx].gender,
      relation: this.heirs[idx].relation,
      isPartner: this.heirs[idx].isPartner,
      name: this.heirs[idx].name,
    });
  }

  /**
   * get number of male heirs for specific power and darajah
   *
   * @param i row index represent power
   * @param j column index represent darajah
   * @returns number of male
   */
  public male(i: number, j: number): number {
    return this.men[i][j];
  }

  /**
   * get number of female heirs for specific power and darajah
   *
   * @param i row index represent power
   * @param j column index represent darajah
   * @returns number of female
   */
  public female(i: number, j: number): number {
    return this.women[i][j];
  }

  /**
   * increament number of heir in this.men or this.women
   * @param i row index, represent heir power
   * @param j column index, represent heir darajah
   * @param gender heir gender
   */
  public increament(i: number, j: number, gender: boolean) {
    if (gender) {
      this.men[i][j] += 1;
    } else {
      this.women[i][j] += 1;
    }
  }

  /**
   * decreament number of heir in this.men or this.women
   * @param i row index, represent heir power
   * @param j column index, represent heir darajah
   * @param gender heir gender
   */
  public decreament(i: number, j: number, gender: boolean) {
    if (gender) {
      this.men[i][j] = 1;
    } else {
      this.women[i][j] -= 1;
    }
  }

  /**
   * get heir's absolute share
   *
   * @param idx index of heir in this.heirs
   * @returns heir's share
   */
  public share(idx: number): Fraction {
    let x = new Fraction(0);
    const heir = this.heirs[idx];
    //partner
    if (heir.isPartner) {
      if (heir.gender) {
        x = this.noFarun ? x.add(1 / 2) : x.add(1 / 4);
      } else {
        x = this.noFarun ? x.add(1 / 4) : x.add(1 / 8);
      }
    } else if (!this.mahjub(idx) && !this.ashabah(idx)) {
      //not a mahjub
      if (heir.gender) {
        //male
        if (heir.power === 1) {
          // father-grand father
          x = x.add(1 / 6);
        } else {
          if (heir.power === 2 && heir.darajah === 2) {
            x = this.female(2, 2) > 1 ? x.add(1 / 3) : x.add(1 / 6); //brother in mother
          }
        }
      } else {
        //female
        switch (heir.power * 10 + heir.darajah) {
          case 0: //daughter
            x = this.lonly(idx) ? x.add(1 / 2) : x.add(2 / 3);
            break;
          case 1: //grand child - so on
          case 2:
            let count = 0,
              i = 0;
            while (i < heir.darajah) {
              count += this.female(heir.power, i);
              i++;
            }
            if (!count) {
              x = this.lonly(idx) ? x.add(1 / 2) : x.add(2 / 3);
            } else if (count === 1) {
              //perfection 2/3
              x = x.add(1 / 6);
            }
            break;
          case 10: //mother
            let siblings = 0;
            this.men[2].forEach((sibling) => {
              siblings += sibling;
            });
            this.women[2].forEach((sibling) => {
              siblings += sibling;
            });
            x = this.noFarun && siblings < 2 ? x.add(1 / 3) : x.add(1 / 6);
            break;
          case 11: //granny
          case 12:
            x = x.add(1 / 6);
            break;
          case 20: //sister
            x = this.lonly(idx) ? x.add(1 / 2) : x.add(2 / 3);
            break;
          case 21: //sister in father
            if (!this.female(2, 0)) {
              //replace sister place
              x = this.lonly(idx) ? x.add(1 / 2) : x.add(2 / 3);
            } else if (this.female(2, 0) === 1) {
              //perfection 2/3 for sisters
              x = x.add(1 / 6);
            }
            break;
          case 22: //sister in mother
            x = this.lonly(idx) ? x.add(1 / 6) : x.add(1 / 3);
            break;
          default:
            break;
        }
      }
    }
    return x;
  }

  /**
   * ashabah
   * @param idx index of heir to check
   * @returns is heir ashabah
   */
  public ashabah(idx: number): boolean {
    const heir = this.heirs[idx];
    if (heir.power === 2 && heir.darajah === 2) return false;
    const bilGhairi =
      heir.power < 4 &&
      (this.male(heir.power, heir.darajah) > 0 ||
        (heir.power === 0 && heir.darajah > 0 && !this.noBoy));
    const maalGhairi =
      this.noBoy && !this.noFarun && heir.power === 2 && heir.darajah < 2;
    if (heir.power === 1) {
      //father-grand father
      return !this.mahjub(idx) && heir.gender && this.noFarun;
    } else {
      return !this.mahjub(idx) && (heir.gender || bilGhairi || maalGhairi);
    }
  }

  /**
   * mahjub
   * @param idx index of heir to check
   * @returns is heir mahjub
   */
  public mahjub(idx: number): boolean {
    let found = true;
    const heir = this.heirs[idx];
    if (heir.power > 3) {
      //liberator - dzawil arham - none family partner
      //is there any family or wife/husband
      if (heir.darajah < 3) {
        this.men.forEach((v) => {
          found = v.every((s) => s === 0) && found;
          if (!found) {
            return !found;
          }
        });
        this.women.forEach((v) => {
          found = v.every((s) => s === 0) && found;
          if (!found) {
            return !found;
          }
        });
        //dzawil arham - partner dzawil arham
        if (heir.darajah === 0) {
          return !found;
        }
        //partner none dawil arham
        if (heir.isPartner) {
          return !found || this.dzawilArham > 0 || this.liberator > 0;
        }
        //liberator
        return !found && this.dzawilArham > 0;
      } else {
        return true;
      }
    }
    found = false;
    //family case
    if (heir.gender) {
      //male
      //find blocker base on power of bone of relation
      //children and parent no need to check blocker by power
      if (heir.power > 2) {
        let i = 0;
        while (i < heir.power && !found) {
          //check i-th column
          found = !this.men[i].every((x) => x === 0);
          i++;
        }
        found =
          found ||
          (!this.kalalah && (this.female(2, 0) > 0 || this.female(2, 1) > 0)); //sister's ashabah maal ghairi
      }
      //find blocker base on darajah (degree) of bone of relation in the same power
      let i = 0;
      //case for nephew, cause they store in men[power][darajah-1]
      let n =
        heir.power === 2 && heir.darajah > 2 ? heir.darajah - 1 : heir.darajah;
      while (i < n && !found) {
        found = this.male(heir.power, i) > 0;
        i++;
      }
      //siblings and grand father: siblings cases
      if (heir.power === 2) {
        switch (heir.darajah) {
          case 0:
            found = this.male(1, 0) > 0 || !this.noBoy;
            break;
          case 1: //brother in father
            found =
              this.male(1, 0) > 0 ||
              !this.noBoy ||
              this.male(2, 0) > 0 ||
              (!this.noFarun && this.female(2, 0) > 0);
            break;
          default: //brother in mother
            found = !this.kalalah;
            break;
        }
      }
    } else {
      //female
      let connection = heir.power * 10 + heir.darajah;
      switch (connection) {
        case 1: //grandchild
        case 2: //great-grandchild
          let i = 0;
          let c = 0;
          while (i < heir.darajah && !found) {
            found = this.male(0, i) > 0;
            c += this.female(0, i);
            i++;
          }
          found = found || c > 1;
          break;
        case 11: //grand mother
          found = this.female(1, 0) > 0;
          break;
        case 20: //sister
          found = !this.noBoy || this.male(1, 0) > 0;
          break;
        case 21: //sister father
          //block by: son, father, sister maal ghairi, two sister perfected 2/3
          found =
            !this.noBoy ||
            this.male(1, 0) > 0 ||
            this.male(2, 0) > 0 ||
            (this.female(2, 0) === 1 && !this.noFarun) ||
            (this.female(2, 0) > 1 && this.siblings(idx) === 0);
          break;
        case 22: //saudara seibu
          found = !this.kalalah;
          break;
        default:
          found = false;
          break;
      }
    }
    return found;
  }

  /**
   * lonly
   * @param idx index of heir to check
   * @returns is heir alone, no heir with same power and darajah
   */
  public lonly(idx: number): boolean {
    const heir = this.heirs[idx];
    return heir.gender
      ? this.male(heir.power, heir.darajah) === 1
      : this.female(heir.power, heir.darajah) === 1;
  }

  /**
   * friends
   * @param idx index of heir to check
   * @returns number of heirs with same power and darajah
   */
  public friends(idx: number): number {
    const heir = this.heirs[idx];
    if (heir.isPartner) {
      return this.partner;
    } else if (heir.power > 3) {
      return heir.darajah === 0 ? this.dzawilArham : this.liberator;
    } else {
      if (heir.power === 2) {
        if (heir.darajah === 2) {
          return this.female(2, 2);
        } else if (heir.darajah > 2) {
          let x = heir.gender ? heir.darajah - 1 : heir.darajah;
          return heir.gender
            ? this.male(heir.power, x)
            : this.female(heir.power, x);
        }
      }
      return heir.gender
        ? this.male(heir.power, heir.darajah)
        : this.female(heir.power, heir.darajah);
    }
  }

  /**
   * siblings
   * @param idx index of heir to check
   * @returns number of heirs with same power and darajah but opposite gender
   */
  public siblings(idx: number): number {
    const heir = this.heirs[idx];
    if (heir.isPartner && heir.power > 3) {
      return this.partner - 1;
    } else if (heir.power === 4 && heir.darajah === 0) {
      return this.liberator - 1;
    } else if (heir.power < 3 && heir.darajah < 3) {
      if (heir.power === 0 && heir.darajah > 0) {
        let c = 0;
        if (heir.gender) {
          if (this.female(0, 0) === 0) {
            const id = this.women[0].findIndex((child) => child > 0);
            if (id > -1) {
              c = this.female(0, id);
            }
          }
        } else if (!this.mahjub(idx)) {
          const id = this.men[0].findIndex((child) => child > 0);
          if (id > -1) {
            c = this.male(0, id);
          }
        }
        return c;
      }
      return heir.gender
        ? this.female(heir.power, heir.darajah)
        : this.male(heir.power, heir.darajah);
    } else {
      return 0;
    }
  }
}
