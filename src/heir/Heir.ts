import error from "../error";

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
  private _relation: Enum["relation"];

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
  constructor({gender, isPartner, relation, name}: HeirParams) {
    const code = this.relationCode[relation];
    if (isPartner && code >= 0 && code < 32) {
      throw error("mahram cant be a partner")
        .heirErr()
        .push({relation: "not allowed to be a partner"});
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
  public set relation(v: Enum["relation"]) {
    const code = this.relationCode[v];
    if (this.isPartner && code >= 0 && code < 32) {
      throw error("mahram cant be a partner")
        .heirErr()
        .push({relation: "not allowed to be apartner"});
    }
    this._relation = v;
  }

  /**
   * relation getter
   */
  public get relation(): Enum["relation"] {
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
        throw error("mahram cant be a partner")
          .heirErr()
          .push({relation: "not allowed to be a partner"});
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
    const code = this.relationCode[this.relation];
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
   * relation code for translate to heir's power and darajah
   */
  private relationCode = {
    parent: 10,
    "grand parent": 11,
    "great grand parent": 12,
    child: 0,
    "grand child": 1,
    "great grand child": 2,
    sibling: 20,
    "sibling father": 21,
    "sibling mother": 22,
    nephew: 23,
    "nephew father": 24,
    uncle: 30,
    "uncle father": 31,
    cousin: 32,
    partner: 40,
    other: 40,
    liberator: 41,
    none: 42,
  };
}
/**
 * Type of Heir parameters
 */
export interface HeirParams {
  name?: string;
  gender: boolean;
  relation: Enum["relation"];
  isPartner?: boolean;
}
/**
 * list of valid relation accepted by calculator
 */
interface Enum {
  relation:
    | "parent"
    | "grand parent"
    | "great grand parent"
    | "child"
    | "grand child"
    | "great grand child"
    | "sibling"
    | "sibling father"
    | "sibling mother"
    | "nephew"
    | "nephew father"
    | "uncle"
    | "uncle father"
    | "cousin"
    | "partner"
    | "other"
    | "liberator"
    | "none";
}

export default Heir;
