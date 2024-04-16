import jwt from "jsonwebtoken";

import { config } from "../../config/index.js";
import {
  ACCESS_TOKEN_COOKIE_EXPIRY_TIME,
  REFRESH_TOKEN_COOKIE_EXPIRY_TIME,
  SECURE_COOKIE_OPTION,
} from "../../constants.js";
import { Users } from "../../models/users.model.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import { ApiResponse } from "../../utils/Response/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    /** DESC :
     *  1. This method is used to generate a refresh token and access token using method generateRefreshToken, generateAccessToken respectively in user.model.js
     *  2. save refresh Token in db for their respective user only
     *  3. return refresh token and access token
     */
    const user = await Users.findById(userId).populate("role__details");
    const accessToken = user.generateAccessToken(user.role__details.role_name);
    const refreshToken = user.generateRefreshToken(
      user.role__details.role_name
    );

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const login = asyncHandler(async (req, res) => {
  console.table(req.body);

  const { username, password } = req.body;
  /** DESC :
   *  1. Get username, password in body
   *  2. Check user existed in db using username
   *    2.1. If NOT existed, throw error "Invalid credentials"
   *    2.2. If existed, processed further.
   *  3. Check password correct or not using isPasswordCorrect method in user.model.js file
   *    3.1. If password is incorrect, throw error "Invalid credentials"
   *    3.2. If password is correct, process further.
   *  4. Generate access token and refresh Token using generateAccessAndRefreshTokens method
   *  5. Use aggregation for, getting role details and hide password, refreshToken, etc.
   *  6. Return response
   *    - Send Http Only Cookies
   *        - Access Token, Refresh Token
   *    - Send loggedInUser Details
   *    - Send AccessToken, Refresh Token in response body
   */

  const existedUser = await Users.findOne({ username });

  if (!existedUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await existedUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existedUser._id
  );

  const loggedInUser = await Users.aggregate([
    {
      // DESC : Stage 1 : Perform a lookup on the "Roles" collection.
      $match: {
        _id: existedUser._id,
      },
    },
    {
      // DESC : Stage 2 : Perform a lookup on the "Roles" collection.
      $lookup: {
        from: "Roles",
        localField: "role", // Match the local field "role" in Users collection
        foreignField: "_id", // foreign field "_id" in Roles collection.
        as: "roleDetails", // Store the matched documents from Roles collection in "roleDetails".
      },
    },
    {
      // DESC : Stage 3 : Add new field role_name and permissions
      $addFields: {
        role_name: { $arrayElemAt: ["$roleDetails.role_name", 0] },
        permissions: { $arrayElemAt: ["$roleDetails.permissions", 0] },
      },
    },
    {
      // DESC : Stage 4 : Exclude few fields
      $project: {
        roleDetails: 0,
        refreshToken: 0,
        password: 0,
      },
    },
  ]);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...SECURE_COOKIE_OPTION,
      expires: new Date(Date.now() + ACCESS_TOKEN_COOKIE_EXPIRY_TIME),
    })
    .cookie("refreshToken", refreshToken, {
      ...SECURE_COOKIE_OPTION,
      expires: new Date(Date.now() + REFRESH_TOKEN_COOKIE_EXPIRY_TIME),
    })
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser[0], accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

export const register = asyncHandler(async (req, res) => {
  /** DESC :
   *  1. Get username, password, role(mongoose ID) in req.body
   *  2. Check username is existed or not
   *    2.1. If existed, throw error "User already exists"
   *    2.2. If not, save data in Users collection
   *  3. Send Response, User registered successfully and all data except password
   */
  const { username, password, role } = req.body;

  const existedUser = await Users.findOne({ username });

  if (!!existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const userObj = await Users.create({
    username,
    password,
    role,
  });

  const { password: pwd, ...result } = userObj.toJSON();

  return res
    .status(201)
    .json(new ApiResponse(201, result, "User registered successfully"));
});

export const assignRoleToUser = asyncHandler(async (req, res) => {
  const { role_id, user_id } = req.body;

  const existedUser = await Users.findById(user_id);

  if (!existedUser) {
    throw new ApiError(404, "User not found");
  }

  const result = await Users.findByIdAndUpdate(
    user_id,
    { role: role_id },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Role assigned successfully"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // DESC : Get all users from users collection with role_name associated with each document
    const users = await Users.aggregate([
      {
        // DESC : Stage 1: Perform a lookup on the "Roles" collection.
        $lookup: {
          from: "Roles",
          localField: "role",
          foreignField: "_id",
          as: "roleDetails",
        },
      },
      {
        // DESC : Stage 2 : Add new field role_name : extract data from roleDetails
        $addFields: {
          role_name: { $arrayElemAt: ["$roleDetails.role_name", 0] },
        },
      },
      {
        // DESC : Stage 3 : Exclude few fields
        $project: {
          roleDetails: 0,
          password: 0,
          refreshToken: 0,
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched successfully"));
  } catch (error) {
    console.log("Error : getAllUsers :: ", error);
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  /** DESC:
   *  1. Protected route, you must be logged in to used this route
   *  2. Pass Current User Details in response
   */
  const data = {
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
    role_name: req.user.role__details.role_name,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { user: data }, "User fetched successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    /** DESC :
     *  1. It's mandatory to pass refresh token either in cookies or body
     *  2. If we don't pass, throw error "Unauthorized request"
     *  3. If we pass it, decode the refresh token
     *  4. Find user details using _id present in payload of decoded token
     *  5. If we don't find user in db, then throw error "Invalid Refresh Token"
     *  6. If refresh token we pass don't match with existing user refresh token then throw error "Refresh token is expired or used" and clear both http cookies from response
     *  7. If they match, generate new refresh token and access token and send it in response and set both access token and refresh token http cookies in response
     */
    console.log("refreshAccessToken");
    console.log("COOKIE = ", req.cookies);
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_SECRET
    );

    const user = await Users.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      console.log("Refresh token not matched with db ❌");
      res
        .clearCookie("accessToken", SECURE_COOKIE_OPTION)
        .clearCookie("refreshToken", SECURE_COOKIE_OPTION);
      throw new ApiError(401, "Refresh token is expired or used");
    }

    console.log("Refresh token matched with db ✅");

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...SECURE_COOKIE_OPTION,
        expires: new Date(Date.now() + ACCESS_TOKEN_COOKIE_EXPIRY_TIME),
      })
      .cookie("refreshToken", newRefreshToken, {
        ...SECURE_COOKIE_OPTION,
        expires: new Date(Date.now() + REFRESH_TOKEN_COOKIE_EXPIRY_TIME),
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const logout = asyncHandler(async (req, res) => {
  /** DESC :
   *  1. This is protected route, you must be logged in to access this route
   *  2. This route will remove the refresh token from the database
   *  3. Clear access token and refresh token http cookies from response
   */
  await Users.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", SECURE_COOKIE_OPTION)
    .clearCookie("refreshToken", SECURE_COOKIE_OPTION)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});
