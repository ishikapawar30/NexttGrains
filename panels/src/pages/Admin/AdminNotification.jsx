import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  CreditCard,
  Package,
  Search,
  ShoppingCart,
  Store,
  Trash2,
  UserPlus,
  Users,
  X,
  AlertTriangle,
  RefreshCw,
  Boxes,
} from "lucide-react";

import {
  getAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationApi";

import "./AdminNotification.css";


const FILTERS = [
  {
    key: "ALL",
    label: "All",
  },
  {
    key: "ORDERS",
    label: "Orders",
  },
  {
    key: "CUSTOMERS",
    label: "Customers",
  },
  {
    key: "VENDORS",
    label: "Vendors",
  },
  {
    key: "PRODUCTS",
    label: "Products",
  },
  {
    key: "PAYMENTS",
    label: "Payments",
  },
];


const getNotificationIcon =
(type) => {

  switch (type) {

    case "CUSTOMER_REGISTERED":
      return <UserPlus />;

    case "VENDOR_REGISTERED":
    case "VENDOR_APPROVED":
      return <Store />;

    case "PRODUCT_ADDED":
    case "PRODUCT_UPDATED":
      return <Boxes />;

    case "ORDER_PLACED":
    case "ORDER_CONFIRMED":
    case "ORDER_CANCELLED":
    case "ORDER_PACKED":
    case "ORDER_SHIPPED":
    case "ORDER_DELIVERED":
      return <ShoppingCart />;

    case "PAYMENT_SUCCESS":
      return <CreditCard />;

    case "PAYMENT_FAILED":
    case "PAYMENT_REFUNDED":
      return <AlertTriangle />;

    case "LOW_STOCK":
      return <Package />;

    default:
      return <Bell />;

  }

};


const getNotificationCategory =
(type) => {

  if (
    type?.startsWith("ORDER_")
  ) {
    return "orders";
  }

  if (
    type ===
    "CUSTOMER_REGISTERED"
  ) {
    return "customers";
  }

  if (
    type === "VENDOR_REGISTERED" ||
    type === "VENDOR_APPROVED"
  ) {
    return "vendors";
  }

  if (
    type === "PRODUCT_ADDED" ||
    type === "PRODUCT_UPDATED"
  ) {
    return "products";
  }

  if (
    type?.startsWith("PAYMENT_")
  ) {
    return "payments";
  }

  return "system";

};


const formatRelativeTime =
(date) => {

  if (!date) {
    return "";
  }

  const now =
    new Date();

  const created =
    new Date(date);

  const diff =
    Math.floor(
      (now - created) / 1000
    );


  if (diff < 60) {
    return "Just now";
  }


  if (diff < 3600) {

    const minutes =
      Math.floor(diff / 60);

    return `${minutes}m ago`;

  }


  if (diff < 86400) {

    const hours =
      Math.floor(diff / 3600);

    return `${hours}h ago`;

  }


  if (diff < 604800) {

    const days =
      Math.floor(diff / 86400);

    return `${days}d ago`;

  }


  return created.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

};


const formatFullDate =
(date) => {

  if (!date) {
    return "";
  }

  return new Date(
    date
  ).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

};


export default function AdminNotification() {

  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const [
    stats,
    setStats,
  ] = useState({

    totalCount: 0,

    unreadCount: 0,

    todayCount: 0,

  });


  const [
    activeFilter,
    setActiveFilter,
  ] = useState("ALL");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    showUnreadOnly,
    setShowUnreadOnly,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    actionId,
    setActionId,
  ] = useState(null);


  const loadNotifications =
    useCallback(
      async (
        showLoader = true
      ) => {

        try {

          if (showLoader) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }


          const data =
            await getAdminNotifications({

              type:
                activeFilter,

              unread:
                showUnreadOnly
                  ? "true"
                  : "false",

              search:
                search.trim(),

              limit: 100,

            });


          setNotifications(
            data.notifications || []
          );


          setStats({

            totalCount:
              data.totalCount || 0,

            unreadCount:
              data.unreadCount || 0,

            todayCount:
              data.todayCount || 0,

          });

        }

        catch (error) {

          console.error(
            "Failed to load notifications:",
            error
          );

        }

        finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      [
        activeFilter,
        showUnreadOnly,
        search,
      ]
    );


  useEffect(() => {

    loadNotifications();

  }, [loadNotifications]);


  // ==================================================
  // AUTO REFRESH
  // ==================================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        loadNotifications(false);

      }, 30000);


    return () =>
      clearInterval(interval);

  }, [loadNotifications]);


  // ==================================================
  // MARK ONE READ
  // ==================================================

  const handleMarkRead =
    async (
      notification
    ) => {

      if (
        notification.isRead
      ) {
        return;
      }


      try {

        setActionId(
          notification._id
        );


        await markNotificationAsRead(
          notification._id
        );


        setNotifications(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                notification._id

                  ? {
                      ...item,
                      isRead: true,
                      readAt:
                        new Date().toISOString(),
                    }

                  : item
            )
        );


        setStats(
          (previous) => ({
            ...previous,

            unreadCount:
              Math.max(
                0,
                previous.unreadCount - 1
              ),

          })
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

      finally {

        setActionId(null);

      }

    };


  // ==================================================
  // MARK ALL
  // ==================================================

  const handleMarkAllRead =
    async () => {

      if (
        stats.unreadCount === 0
      ) {
        return;
      }


      try {

        setActionId(
          "all"
        );


        await markAllNotificationsAsRead();


        setNotifications(
          (previous) =>
            previous.map(
              (item) => ({
                ...item,

                isRead: true,

                readAt:
                  new Date().toISOString(),

              })
            )
        );


        setStats(
          (previous) => ({
            ...previous,

            unreadCount: 0,

          })
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

      finally {

        setActionId(null);

      }

    };


  // ==================================================
  // DELETE
  // ==================================================

  const handleDelete =
    async (
      notificationId
    ) => {

      try {

        setActionId(
          notificationId
        );


        await deleteNotification(
          notificationId
        );


        setNotifications(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                notificationId
            )
        );


        setStats(
          (previous) => ({
            ...previous,

            totalCount:
              Math.max(
                0,
                previous.totalCount - 1
              ),

          })
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

      finally {

        setActionId(null);

      }

    };


  const visibleNotifications =
    useMemo(() => {

      return notifications;

    }, [notifications]);


  return (

    <div className="adminNotificationPage">


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="notificationPageHeader">

        <div>

          <div className="notificationEyebrow">

            <span className="eyebrowDot"></span>

            ADMIN ACTIVITY CENTER

          </div>


          <h1>
            Notifications
          </h1>


          <p>
            Stay updated with everything
            happening across NextTGrains.
          </p>

        </div>


        <div className="notificationHeaderActions">

          <button
            className="refreshNotificationBtn"
            onClick={() =>
              loadNotifications(false)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "spinIcon"
                  : ""
              }
            />

            Refresh

          </button>


          <button
            className="markAllBtn"
            onClick={
              handleMarkAllRead
            }
            disabled={
              stats.unreadCount === 0 ||
              actionId === "all"
            }
          >

            <CheckCheck
              size={17}
            />

            Mark all read

          </button>

        </div>

      </div>


      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="notificationStatsGrid">


        <div className="notificationStatCard">

          <div className="notificationStatIcon total">
            <Bell size={20} />
          </div>

          <div>

            <span>
              Total notifications
            </span>

            <strong>
              {stats.totalCount}
            </strong>

          </div>

        </div>


        <div className="notificationStatCard">

          <div className="notificationStatIcon unread">
            <Bell size={20} />
          </div>

          <div>

            <span>
              Unread
            </span>

            <strong>
              {stats.unreadCount}
            </strong>

          </div>

        </div>


        <div className="notificationStatCard">

          <div className="notificationStatIcon today">
            <Clock3 size={20} />
          </div>

          <div>

            <span>
              Today
            </span>

            <strong>
              {stats.todayCount}
            </strong>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* TOOLBAR */}
      {/* ================================================= */}

      <div className="notificationToolbar">


        <div className="notificationSearch">

          <Search
            size={19}
          />

          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />


          {search && (

            <button
              onClick={() =>
                setSearch("")
              }
              className="clearSearchBtn"
            >

              <X
                size={15}
              />

            </button>

          )}

        </div>


        <div className="notificationFilters">

          {FILTERS.map(
            (filter) => (

              <button
                key={filter.key}
                className={
                  activeFilter ===
                  filter.key
                    ? "notificationFilter active"
                    : "notificationFilter"
                }
                onClick={() =>
                  setActiveFilter(
                    filter.key
                  )
                }
              >

                {filter.label}

              </button>

            )
          )}

        </div>


        <button
          className={
            showUnreadOnly
              ? "unreadToggle active"
              : "unreadToggle"
          }
          onClick={() =>
            setShowUnreadOnly(
              (value) => !value
            )
          }
        >

          <span className="toggleDot"></span>

          Unread only

        </button>

      </div>


      {/* ================================================= */}
      {/* NOTIFICATIONS */}
      {/* ================================================= */}

      <div className="notificationListSection">


        <div className="notificationListHeader">

          <div>

            <h2>
              Recent activity
            </h2>

            <span>
              {visibleNotifications.length} notifications
            </span>

          </div>

        </div>


        {loading ? (

          <div className="notificationLoading">

            <div className="notificationSpinner"></div>

            <p>
              Loading notifications...
            </p>

          </div>

        ) : visibleNotifications.length === 0 ? (

          <div className="notificationEmpty">

            <div className="emptyNotificationIcon">

              <Bell
                size={30}
              />

            </div>

            <h3>
              You're all caught up
            </h3>

            <p>
              No notifications match your
              current filters.
            </p>

            {(search ||
              showUnreadOnly ||
              activeFilter !== "ALL") && (

              <button
                onClick={() => {

                  setSearch("");

                  setShowUnreadOnly(
                    false
                  );

                  setActiveFilter(
                    "ALL"
                  );

                }}
              >
                Clear filters
              </button>

            )}

          </div>

        ) : (

          <div className="notificationList">

            {visibleNotifications.map(
              (notification) => {

                const category =
                  getNotificationCategory(
                    notification.type
                  );


                return (

                  <article
                    key={
                      notification._id
                    }
                    className={
                      notification.isRead
                        ? "notificationCard read"
                        : "notificationCard unread"
                    }
                  >


                    <div
                      className={`notificationIcon ${category}`}
                    >

                      {getNotificationIcon(
                        notification.type
                      )}

                    </div>


                    <div className="notificationContent">

                      <div className="notificationTopLine">

                        <div className="notificationTitleWrap">

                          {!notification.isRead && (

                            <span className="unreadIndicator"></span>

                          )}

                          <h3>
                            {notification.title}
                          </h3>

                        </div>


                        <span
                          className="notificationTime"
                          title={formatFullDate(
                            notification.createdAt
                          )}
                        >

                          <Clock3
                            size={13}
                          />

                          {formatRelativeTime(
                            notification.createdAt
                          )}

                        </span>

                      </div>


                      <p className="notificationMessage">
                        {notification.message}
                      </p>


                      {notification.metadata &&
                        Object.keys(
                          notification.metadata
                        ).length > 0 && (

                        <div className="notificationMeta">

                          {notification.metadata
                            .orderNumber && (

                            <span>
                              Order #
                              {
                                notification
                                  .metadata
                                  .orderNumber
                              }
                            </span>

                          )}


                          {notification.metadata
                            .amount !==
                            undefined && (

                            <span>
                              ₹
                              {Number(
                                notification
                                  .metadata
                                  .amount
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          )}


                          {notification.metadata
                            .customerName && (

                            <span>
                              {
                                notification
                                  .metadata
                                  .customerName
                              }
                            </span>

                          )}

                        </div>

                      )}


                      <div className="notificationActions">


                        {!notification.isRead && (

                          <button
                            className="notificationActionBtn primary"
                            onClick={() =>
                              handleMarkRead(
                                notification
                              )
                            }
                            disabled={
                              actionId ===
                              notification._id
                            }
                          >

                            <Check
                              size={15}
                            />

                            Mark as read

                          </button>

                        )}


                        {notification.isRead && (

                          <span className="readStatus">

                            <Check
                              size={14}
                            />

                            Read

                          </span>

                        )}


                        <button
                          className="notificationActionBtn delete"
                          onClick={() =>
                            handleDelete(
                              notification._id
                            )
                          }
                          disabled={
                            actionId ===
                            notification._id
                          }
                        >

                          <Trash2
                            size={14}
                          />

                          Delete

                        </button>

                      </div>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

}