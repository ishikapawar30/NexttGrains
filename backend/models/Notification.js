import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["admin", "customer", "vendor"],
      required: true,
      index: true,
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "CUSTOMER_REGISTERED",
        "VENDOR_REGISTERED",
        "VENDOR_APPROVED",

        "PRODUCT_ADDED",
        "PRODUCT_UPDATED",

        "ORDER_PLACED",
        "ORDER_CONFIRMED",
        "ORDER_CANCELLED",

        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "PAYMENT_REFUNDED",

        "ORDER_PACKED",
        "ORDER_SHIPPED",
        "ORDER_DELIVERED",

        "LOW_STOCK",

        "SYSTEM",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    entityType: {
      type: String,
      enum: [
        "user",
        "vendor",
        "product",
        "order",
        "payment",
        "shipment",
        "system",
      ],
      default: "system",
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
      default: null,
    },

    emailError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  recipientType: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipientType: 1,
  isRead: 1,
  createdAt: -1,
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;