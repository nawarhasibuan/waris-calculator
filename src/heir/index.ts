import Heir, {heirArgs} from "./Heir";

export default function heir(args: heirArgs) {
  return new Heir({...args});
}

export {heirArgs, Heir};
