import { ApiError } from "../utils/Error/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Users } from "../models/users.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    console.log("Cookies = ", req.cookies);
    console.log("Header = ", req.header("Authorization"));

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(`🚀 ~ verifyJWT ~ token:`, token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(`🚀 ~ verifyJWT ~ decodedToken:`, decodedToken);

    const user = await Users.findById(decodedToken?._id)
      .populate("role__details")
      .select("-password -refreshToken");
    console.log(`🚀 ~ verifyJWT ~ user:`, user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
