import { Schema, model, models } from "mongoose";

export const PERMISSIONS = [
  "users:create",
  "users:read",
  "users:update",
  "users:delete",
  "roles:create",
  "roles:read",
  "roles:update",
  "roles:delete",
  "products:create",
  "products:read",
  "products:update",
  "products:delete",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: PERMISSIONS,
      default: [],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Role || model("Role", roleSchema);