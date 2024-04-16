import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/Response/ApiResponse.js";

export const healthCheck = asyncHandler((req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "OK", "Server is running 🚀🚀"));
});
