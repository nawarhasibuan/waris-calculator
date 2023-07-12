import Deceased, {deceasedArgs} from "./Deceased";

export default function deceased(args: deceasedArgs) {
  return new Deceased({...args});
}

export {deceasedArgs, Deceased};
