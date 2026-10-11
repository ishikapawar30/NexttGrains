import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotifications,
  getAdminNotifications,
  getAdminUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();


// =====================================================
// ADMIN
// =====================================================

// GET /api/notifications/admin
router.get(
  "/admin",
  authMiddleware,
  getAdminNotifications
);


// GET /api/notifications/admin/unread-count
router.get(
  "/admin/unread-count",
  authMiddleware,
  getAdminUnreadCount
);


// =====================================================
// CURRENT USER
// =====================================================

// GET /api/notifications
router.get(
  "/",
  authMiddleware,
  getNotifications
);


// =====================================================
// READ
// =====================================================

// PUT /api/notifications/read/:notificationId
router.put(
  "/read/:notificationId",
  authMiddleware,
  markAsRead
);


// =====================================================
// READ ALL
// =====================================================

// PUT /api/notifications/read-all
router.put(
  "/read-all",
  authMiddleware,
  markAllAsRead
);


// =====================================================
// DELETE
// =====================================================

// DELETE /api/notifications/:notificationId
router.delete(
  "/:notificationId",
  authMiddleware,
  deleteNotification
);


export default router;