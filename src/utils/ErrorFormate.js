class ErrorFormater extends Error {
  constructor(
    message = "somthing went wrong",
    errors = [],
    statusCode
    // stack = ""
  ) {
    super(message);
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.statusCode = statusCode;

    // if (stack) {
    //   this.stack = stack;
    // } else {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}
export { ErrorFormater };
