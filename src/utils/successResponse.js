class successResponse {
  constructor(
    statusCode = 201,
    data = {},
    message = "Data fetched successfully"
  ) {
    this.success = true;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export default successResponse;
