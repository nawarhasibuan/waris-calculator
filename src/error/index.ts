import WarisError from "./WarisError";

/**
 * create error
 * @param message error message
 * @returns WarisError
 */
export default function error(message: string) {
  return new WarisError(message);
}

export {WarisError};
