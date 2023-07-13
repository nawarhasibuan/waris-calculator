import Heir, {HeirParams} from "./Heir";
/**
 * create heir
 * @param args heirs data
 * @returns heir instance
 */
export default function heir(args: HeirParams) {
  return new Heir({...args});
}

export {HeirParams, Heir};
