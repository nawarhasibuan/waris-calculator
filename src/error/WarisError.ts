/**
 * Custom error in package
 */
export default class WarisError extends Error {
  /**
   * list errors
   */
  errors: any[];
  /**
   * create custom error
   * @param message message of errors
   */
  constructor(message: string) {
    super(message);
    this.name = "WarisError";
    this.errors = [];
  }
  /**
   * change error name to HeirError
   * @returns this
   */
  heirErr() {
    this.name = "HeirError";
    return this;
  }
  /**
   * change error name to DeceasedErro
   * @returns this
   */
  decErr() {
    this.name = "DeceasedError";
    return this;
  }
  /**
   * change error name to CalculatorError
   * @returns this
   */
  calcErr() {
    this.name = "CalculatorError";
    return this;
  }
  /**
   * push error occurred
   * @param error error occurred
   * @returns this error
   */
  push(error: any) {
    this.errors.push(error);
    return this;
  }
}
