/**
 * Class to create Heir object
 * @author Panawar Hasibuan
 * @email panawarhsb28@gmail.com
 */
class Heir {
  /**
   * name of heir
   */
  name?: string;

  /**
   * gender of heir
   */
  gender: boolean;

  /**
   * relation with deceased
   */
  private _relation: string;

  /**
   * is this heir is partner of the deceased
   */
  private _isPartner: boolean;

  /**
   * Constructor of Heir
   * @param gender gender of Heir
   * @param isPartner Heir is partner of deceased or not
   * @param relation relation between Heir and Deceased
   * @param name name of Heir
   */
  constructor({gender, isPartner, relation, name}: heirArgs) {
    const code = this.codeRelation(relation);
    if (isPartner && code >= 0 && code < 32) {
      throw new Error("mahram cant be a partner");
    }
    if (name) {
      this.name = name;
    }
    this.gender = gender;
    this._relation = relation;
    this._isPartner = isPartner || false;
  }

  /**
   * relation setter
   * @throws Error
   */
  public set relation(v: string) {
    const code = this.codeRelation(v);
    if (this.isPartner && code >= 0 && code < 32) {
      throw new Error("mahram cant be a partner");
    }
    this._relation = v;
  }

  /**
   * relation getter
   */
  public get relation(): string {
    return this._relation;
  }

  /**
   * isPartner setter
   *
   * @throws Error
   */
  public set isPartner(v: boolean) {
    if (this.isPartner !== v) {
      if (v && this.code >= 0 && this.code < 32) {
        throw new Error("mahram cant be a partner");
      }
    }
    this._isPartner = v;
  }

  /**
   * isPartner getter
   */
  public get isPartner(): boolean {
    return this._isPartner;
  }

  /**
   * code heir relation
   */
  public get code(): number {
    const code = this.codeRelation(this.relation);
    return code > 22 && code < 40 && !this.gender ? 40 : code;
  }

  /**
   * child stronger then grand child in darajah
   */
  public get power(): number {
    return Math.floor(this.code / 10);
  }

  /**
   * Power of relation to inheritor. not a family relation, set to -1. child stronger then siblings in power
   */
  public get darajah(): number {
    return this.code % 10;
  }

  /**
   * toString
   * @returns name of Heir
   */
  public toString(): string {
    return this.name || "";
  }

  /**
   * code of relation
   *
   * @param relation relation of heir
   * @returns code of the relation
   */
  private codeRelation(relation: string): number {
    const family = [
      ["child", "grand child", "great grand child"],
      ["parent", "grand parent", "great grand parent"],
      [
        "sibling",
        "sibling father",
        "sibling mother",
        "nephew",
        "nephew father",
      ],
      ["uncle", "uncle father", "cousin"],
      ["other", "liberator", "none"],
    ];
    let x: number = 42;
    family.forEach((elmt, index) => {
      x = elmt.indexOf(relation) > -1 ? index * 10 + elmt.indexOf(relation) : x;
    });
    return x;
  }
}

export type heirArgs = {
  name?: string;
  gender: boolean;
  relation: string;
  isPartner?: boolean;
};

enum RelationList {
  partner = "partner",
  other = "other",
  liberator = "liberator",
  none = "none",

  greatGrandFather = "great grand father",
  grandFather = "grand father",
  father = "father",

  child = "child",
  grandChild = "grand child",
  greatGrandChild = "great grand child",

  sibling = "sibling",
  siblingFather = "sibling father",
  siblingMother = "sibling mother",
  nephew = "nephew",
  nephewFather = "nephew-father",

  uncle = "uncle",
  uncleFather = "uncle-father",
  cousin = "cousin",
}

export default Heir;
