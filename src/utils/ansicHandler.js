import { ErrorFormater } from "./ErrorFormate.js";

function asyncHandler(heandler) {
  return async function (req, res, next) {
    try {
      await heandler(req, res, next);
    } catch (error) {
      console.log(error);

      next(error);
    }
  };
}
export default asyncHandler;
