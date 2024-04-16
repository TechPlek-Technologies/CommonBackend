import mongoose from "mongoose";
import { AvailablePermissions, PermissionsEnum } from "../constants.js";

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: [true, "Please provide a role"],
      unique: [true, "Please provide a unique role"],
      trim: true,
      uppercase: true,
    },
    permissions: {
      type: [String],
      required: [true, "Please provide at least one permission"],
      trim: true,
      // Setter to transform each permission to uppercase
      set: function (permissions) {
        if (!Array.isArray(permissions)) {
          return [];
        }
        // Convert each permission to uppercase
        return permissions.map((permission) => permission.trim().toUpperCase());
      },
      validate: {
        validator: function (permissions) {
          return new Set(permissions).size === permissions.length;
        },
        message: "Permissions must be unique",
      },
    },
  },
  { timestamps: true }
);

export const Roles = mongoose.model("Roles", roleSchema, "Roles");
