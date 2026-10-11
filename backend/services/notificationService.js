import Notification from "../models/Notification.js";
import { sendEmail } from "./emailService.js";
import { getSocketIO } from "../utils/socket.js";
import { getIO } from "../socket/socket.js";

export const createNotification = async ({
  recipientType,
  recipientId = null,

  type,

  title,
  message,

  entityType = "system",
  entityId = null,

  metadata = {},

  email = null,
  emailSubject = null,
  emailHtml = null,
  emailText = "",
}) => {

  let notification;

  // =====================================================
  // 1. SAVE TO DATABASE FIRST
  // =====================================================

  try {

    notification = await Notification.create({

      recipientType,
      recipientId,

      type,

      title,
      message,

      entityType,
      entityId,

      metadata,

      isRead: false,

      emailSent: false,

    });

  } catch (error) {

    console.error(
      "❌ Failed to create notification:",
      error
    );

    throw error;

  }


  // =====================================================
  // 2. REALTIME SOCKET
  // =====================================================

  try {

    const io = getSocketIO();

    if (io) {

      const payload =
        notification.toObject();

      // -------------------------------
      // ADMIN
      // -------------------------------

      if (
        recipientType === "admin"
      ) {

        io.to("admins").emit(
          "admin:notification",
          payload
        );

      }

      // -------------------------------
      // CUSTOMER / VENDOR
      // -------------------------------

      if (
        recipientId
      ) {

        io.to(
          `user:${recipientId.toString()}`
        ).emit(
          "notification",
          payload
        );

      }

    }

  } catch (socketError) {

    console.error(
      "❌ Notification socket error:",
      socketError.message
    );

    // Socket failure must NEVER
    // break business transaction.

  }


  // =====================================================
  // 3. EMAIL
  // =====================================================

  if (email) {

    try {

      await sendEmail({

        to: email,

        subject:
          emailSubject ||
          title,

        html:
          emailHtml ||
          `<p>${message}</p>`,

        text:
          emailText ||
          message,

      });


      notification.emailSent = true;

      notification.emailSentAt =
        new Date();

      notification.emailError =
        null;

      await notification.save();

    } catch (error) {

      notification.emailSent = false;

      notification.emailError =
        error.message;

      await notification.save();

      console.error(
        "❌ Notification email failed:",
        error.message
      );

    }

  }


  return notification;

};
// ==========================================
// REALTIME NOTIFICATION
// ==========================================

const socketIO = io || getIO();

if (
  socketIO &&
  recipientType === "admin"
) {

  socketIO
    .to("admins")
    .emit(
      "admin:notification",
      notification.toObject
        ? notification.toObject()
        : notification
    );

  console.log(
    "🔔 Admin notification emitted:",
    notification.title
  );
}