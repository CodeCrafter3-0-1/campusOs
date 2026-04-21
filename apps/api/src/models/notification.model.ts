import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ["alert", "resource", "job", "success"], required: true },
    read: { type: Boolean, default: false },
    createdAt: String,
  },
  { timestamps: true },
);

export const NotificationModel = model("Notification", notificationSchema);
