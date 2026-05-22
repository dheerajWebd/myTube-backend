import successResponse from "../utils/successResponse.js";

const rerponseMiddlewere = (req, res, next) => {
  res.success = (
    statusCode = 201,
    data = {},
    message = "Data fetched successfully"
  ) => {
    const response = new successResponse(statusCode, data, message);
    return res.status(statusCode).json(response);
  };
  next();
};

export default rerponseMiddlewere;
