import Deceased from "../deceased/Deceased";
import Calculator from "./Calculator";

export default function calculator(d?: Deceased) {
  return new Calculator(d);
}

export {Calculator};
