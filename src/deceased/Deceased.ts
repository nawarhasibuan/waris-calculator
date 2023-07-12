/**
 * Class to create Deceased object
 * @author Panawar Hasibuan
 * @email panawarhsb28@gmail.com
 */
class Deceased {
  /**
   * name of deceased
   */
  name?: string;

  /**
   * gender of deceased
   */
  readonly gender: boolean;

  /**
   * wealth of deceased when he/she died
   */
  estate: number;

  /**
   * Constructor of Deceased
   * @param name name of Deceased
   * @param gender gender of Deceased
   * @param estate number of inheritance
   * @default estate 100
   */
  constructor({name, gender, estate = 100}: deceasedArgs) {
    if (name) {
      this.name = name;
    }
    this.gender = gender;
    this.estate = estate;
  }

  /**
   * toString
   * @returns name of Deceased
   */
  public toString(): string {
    return this.name || "";
  }
}

export type deceasedArgs = {
  name?: string;
  gender: boolean;
  estate?: number;
};

export default Deceased;
