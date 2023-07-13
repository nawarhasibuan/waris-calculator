import Deceased, {deceasedArgs} from "./Deceased";
/**
 * create deceased
 * @param args deceased data
 * @returns deceased instance
 */
export default function deceased(args: deceasedArgs) {
  return new Deceased({...args});
}

export {deceasedArgs, Deceased};
