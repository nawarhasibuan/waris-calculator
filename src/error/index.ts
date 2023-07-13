import WarisError from "./WarisError";

export default function error(message: string) {
  return new WarisError(message);
}

export {WarisError};
