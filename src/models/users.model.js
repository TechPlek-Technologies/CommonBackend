import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants.js";
import { config } from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: [true, "Please provide a unique username"],
      trim: true,
      index: true,
      minLength: [3, "Username should be at least 3 characters long"],
      maxLength: [10, "Username should be at least 10 characters long"],
      validate: {
        validator: function (username) {
          // Check if the first character of username is a letter
          return /^[A-Za-z]/.test(username);
        },
        message: "Username must start with a letter",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      trim: true,
      minLength: [
        MIN_PASSWORD_LENGTH,
        `Password should be at least ${MIN_PASSWORD_LENGTH} characters long`,
      ],
      maxLength: [
        MAX_PASSWORD_LENGTH,
        `Password should be at least ${MAX_PASSWORD_LENGTH} characters long`,
      ],
      validate: {
        validator: function (password) {
          // Password must contain at least one uppercase letter, one lowercase letter,
          // one special character, and one digit
          const minLength = MIN_PASSWORD_LENGTH;
          const regexPattern = new RegExp(
            `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{${minLength},}$`
          );
          return regexPattern.test(password);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one special character, and one digit",
      },
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ensure virtuals are populated when converting to JSON
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });
// Virtual field to populate 'role_name' from 'Roles' collection
userSchema.virtual("role__details", {
  ref: "Roles",
  localField: "role",
  foreignField: "_id",
  justOne: true,
  // options: { select: "role_name" },
});

// POINT : hash password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// POINT : compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (role_name) {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: role_name,
    },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function (role_name) {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: role_name,
    },
    config.REFRESH_TOKEN_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Users = mongoose.model("Users", userSchema, "Users");
