import Notification from "../models/Notification.js";


// ======================================================
// GET CURRENT USER NOTIFICATIONS
// ======================================================

export const getNotifications = async (req, res) => {

  try {

    const userId = req.user?.id;

    if (!userId) {

      return res.status(401).json({

        success: false,

        message: "Authentication required",

      });

    }


    const limit = Math.min(

      Number(req.query.limit) || 50,

      100

    );


    const notifications =
      await Notification.find({

        recipientId: userId,

      })

        .sort({

          createdAt: -1,

        })

        .limit(limit)

        .lean();


    const unreadCount =
      await Notification.countDocuments({

        recipientId: userId,

        isRead: false,

      });


    return res.status(200).json({

      success: true,

      notifications,

      unreadCount,

    });

  }

  catch (error) {

    console.error(
      "getNotifications:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch notifications",

    });

  }

};



// ======================================================
// GET ADMIN NOTIFICATIONS
// ======================================================

export const getAdminNotifications =
async (req, res) => {

  try {

    if (req.user?.role !== "admin") {

      return res.status(403).json({

        success: false,

        message: "Admin access required",

      });

    }


    const limit = Math.min(

      Number(req.query.limit) || 100,

      200

    );


    const {

      type,

      unread,

      search,

    } = req.query;


    const filter = {

      recipientType: "admin",

    };


    // ----------------------------
    // TYPE FILTER
    // ----------------------------

    if (
      type &&
      type !== "ALL"
    ) {

      const typeMap = {

        ORDERS: [
          "ORDER_PLACED",
          "ORDER_CONFIRMED",
          "ORDER_CANCELLED",
          "ORDER_PACKED",
          "ORDER_SHIPPED",
          "ORDER_DELIVERED",
        ],

        CUSTOMERS: [
          "CUSTOMER_REGISTERED",
        ],

        VENDORS: [
          "VENDOR_REGISTERED",
          "VENDOR_APPROVED",
        ],

        PRODUCTS: [
          "PRODUCT_ADDED",
          "PRODUCT_UPDATED",
        ],

        PAYMENTS: [
          "PAYMENT_SUCCESS",
          "PAYMENT_FAILED",
          "PAYMENT_REFUNDED",
        ],

        SYSTEM: [
          "LOW_STOCK",
          "SYSTEM",
        ],

      };


      if (typeMap[type]) {

        filter.type = {
          $in: typeMap[type],
        };

      }

    }


    // ----------------------------
    // UNREAD
    // ----------------------------

    if (unread === "true") {

      filter.isRead = false;

    }


    // ----------------------------
    // SEARCH
    // ----------------------------

    if (search?.trim()) {

      filter.$or = [

        {
          title: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },

        {
          message: {
            $regex:
              search.trim(),
            $options: "i",
          },
        },

      ];

    }


    const notifications =
      await Notification.find(filter)

        .sort({

          createdAt: -1,

        })

        .limit(limit)

        .lean();


    const unreadCount =
      await Notification.countDocuments({

        recipientType: "admin",

        isRead: false,

      });


    const totalCount =
      await Notification.countDocuments({

        recipientType: "admin",

      });


    const todayStart =
      new Date();

    todayStart.setHours(
      0,
      0,
      0,
      0
    );


    const todayCount =
      await Notification.countDocuments({

        recipientType: "admin",

        createdAt: {
          $gte: todayStart,
        },

      });


    return res.status(200).json({

      success: true,

      notifications,

      unreadCount,

      totalCount,

      todayCount,

    });

  }

  catch (error) {

    console.error(
      "getAdminNotifications:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch admin notifications",

    });

  }

};



// ======================================================
// GET ADMIN UNREAD COUNT
// ======================================================

export const getAdminUnreadCount =
async (req, res) => {

  try {

    if (req.user?.role !== "admin") {

      return res.status(403).json({

        success: false,

        message: "Admin access required",

      });

    }


    const unreadCount =
      await Notification.countDocuments({

        recipientType: "admin",

        isRead: false,

      });


    return res.status(200).json({

      success: true,

      unreadCount,

    });

  }

  catch (error) {

    console.error(
      "getAdminUnreadCount:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch unread count",

    });

  }

};



// ======================================================
// MARK ONE AS READ
// ======================================================

export const markAsRead =
async (req, res) => {

  try {

    const notificationId =
      req.params.notificationId;


    const userId =
      req.user?.id;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message: "Authentication required",

      });

    }


    const notification =
      await Notification.findOne({

        _id: notificationId,

        $or: [

          {
            recipientId: userId,
          },

          {
            recipientType: "admin",

            ...(req.user.role === "admin"
              ? {}
              : {
                  _id: null,
                }),

          },

        ],

      });


    if (!notification) {

      return res.status(404).json({

        success: false,

        message: "Notification not found",

      });

    }


    notification.isRead = true;

    notification.readAt =
      new Date();


    await notification.save();


    return res.status(200).json({

      success: true,

      message:
        "Notification marked as read",

      notification,

    });

  }

  catch (error) {

    console.error(
      "markAsRead:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to mark notification as read",

    });

  }

};



// ======================================================
// MARK ALL AS READ
// ======================================================

export const markAllAsRead =
async (req, res) => {

  try {

    const userId =
      req.user?.id;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message: "Authentication required",

      });

    }


    const filter =
      req.user.role === "admin"

        ? {
            recipientType: "admin",
            isRead: false,
          }

        : {
            recipientId: userId,
            isRead: false,
          };


    const result =
      await Notification.updateMany(

        filter,

        {

          $set: {

            isRead: true,

            readAt: new Date(),

          },

        }

      );


    return res.status(200).json({

      success: true,

      message:
        "All notifications marked as read",

      modifiedCount:
        result.modifiedCount,

    });

  }

  catch (error) {

    console.error(
      "markAllAsRead:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to mark notifications as read",

    });

  }

};



// ======================================================
// DELETE NOTIFICATION
// ======================================================

export const deleteNotification =
async (req, res) => {

  try {

    const userId =
      req.user?.id;


    if (!userId) {

      return res.status(401).json({

        success: false,

        message: "Authentication required",

      });

    }


    const filter = {

      _id:
        req.params.notificationId,

      ...(req.user.role === "admin"

        ? {
            recipientType: "admin",
          }

        : {
            recipientId: userId,
          }),

    };


    const deleted =
      await Notification.findOneAndDelete(
        filter
      );


    if (!deleted) {

      return res.status(404).json({

        success: false,

        message: "Notification not found",

      });

    }


    return res.status(200).json({

      success: true,

      message:
        "Notification deleted",

    });

  }

  catch (error) {

    console.error(
      "deleteNotification:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete notification",

    });

  }

};