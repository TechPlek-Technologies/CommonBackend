import { config } from "./config/index.js";

export const DB_NAME = "CAB-APPLICATION";

export const UserRolesEnum = {
  ADMIN: "Admin",
  MANAGER_MIS: "MANAGER_MIS",
  ACCOUNTANT_FINANCE: "ACCOUNTANT_FINANCE",
  SUPERVISOR: "SUPERVISOR",
  CLIENT: "CLIENT",
  CLIENT_HR_ADMIN: "CLIENT_HR_ADMIN",
  VENDOR: "VENDOR",
  VENDOR_SUPERVISOR: "VENDOR_SUPERVISOR",
  DRIVER: "DRIVER",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const MaxRequestBodySize = "16kb";

export const PermissionsEnum = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  READ: "READ",
  WRITE: "WRITE",
  READWRITE: "READWRITE",
};

export const AvailablePermissions = Object.values(PermissionsEnum);

export const StatusEnum = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPEND: "SUSPEND",
};

export const AvailableStatus = Object.values(StatusEnum);

export const MIN_PASSWORD_LENGTH = 5;
export const MAX_PASSWORD_LENGTH = 15;

export const SECURE_COOKIE_OPTION = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
};

export const ACCESS_TOKEN_COOKIE_EXPIRY_TIME = 1 * 60 * 60 * 1000; // 1 HOUR
// export const ACCESS_TOKEN_COOKIE_EXPIRY_TIME = 1 * 60 * 1000; // 1 MINUTE

export const REFRESH_TOKEN_COOKIE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 1 DAY
// export const REFRESH_TOKEN_COOKIE_EXPIRY_TIME = 2 * 60 * 1000; // 2 MINUTE
