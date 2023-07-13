import Heir, {HeirParams} from "./Heir";

export default function heir(args: HeirParams) {
  return new Heir({...args});
}

export {HeirParams, Heir};
