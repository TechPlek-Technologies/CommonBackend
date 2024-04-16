import { Roles } from "../../models/roles.model.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import { ApiResponse } from "../../utils/Response/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createRole = asyncHandler(async (req, res) => {
  /** DESC : Create a new Role
   *  1. Get role_name, permissions in req.body
   *  2. Check role_name is existed in Roles Collection
   *    2.1. If role_name exists, throw error "Role already exists"
   *    2.2. If role_name does not exist, proceed further.
   *  3. Create a new role in Roles Collection and return response
   */
  const { role_name, permissions } = req.body;

  console.table({ role_name });

  const existedRole = await Roles.findOne({ role_name });

  if (!!existedRole) {
    throw new ApiError(409, "Role already exists");
  }

  const roleObj = await Roles.create({
    role_name,
    permissions,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, roleObj, "New Role Created Successfully"));
});
