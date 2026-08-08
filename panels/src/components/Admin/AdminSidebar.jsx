import React, { useState } from "react";
import "./AdminSidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Boxes,
  ShoppingCart,
  PackageSearch,
  Ticket,
  Image,
  Newspaper,
  FileText,
  Wallet,
  BarChart3,
  Bell,
  LifeBuoy,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const menuItems=[
// {
// title:"Dashboard",
// path:"/",
// icon:<LayoutDashboard size={22}/>
// },

{
title:"Customers",
path:"/admin/customers",
icon:<Users size={22}/>
},

{
title:"Vendors",
path:"/admin/vendors",
icon:<Store size={22}/>
},

{
title:"Products",
path:"/admin/products",
icon:<Boxes size={22}/>
},

{
title:"Orders",
path:"/admin/orders",
icon:<ShoppingCart size={22}/>
},

// {
// title:"Inventory",
// path:"/admin/inventory",
// icon:<PackageSearch size={22}/>
// },

{
title:"Coupons",
path:"/admin/coupons",
icon:<Ticket size={22}/>
},


{
title:"Banners",
path:"/admin/banners",
icon:<Image size={22}/>
},

{
title:"Blogs",
path:"/admin/blogs",
icon:<Newspaper size={22}/>
},

{
  title: "Website Content",
  path: "/admin/website-content",
  icon: <LayoutDashboard size={22} />,
},


{
title:"Finance",
path:"/admin/finance",
icon:<Wallet size={22}/>
},

{
title:"Reports",
path:"/admin/reports",
icon:<BarChart3 size={22}/>
},

{
title:"Notifications",
path:"/admin/notifications",
icon:<Bell size={22}/>
},

// {
// title:"Support Tickets",
// path:"/admin/support",
// icon:<LifeBuoy size={22}/>
// },

// {
// title:"Audit Logs",
// path:"/admin/auditlogs",
// icon:<ScrollText size={22}/>
// },

{
title:"Settings",
path:"/admin/settings",
icon:<Settings size={22}/>
},

];

export default function AdminSidebar() {

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
  navigate("/admin/login", { replace: true });
};

  return (

    <div className={`adminSidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebarTop">

        <div className="logoCircle">
          N
        </div>

        {!collapsed && (
          <div>

            <h2>NextTGrains</h2>

            <span>ADMIN CONSOLE</span>

          </div>
        )}

      </div>

      <div className="menuContainer">

        {menuItems.map((item, index) => (

<NavLink
    to={item.path}
    key={index}
    className={({ isActive }) =>
        `menuItem ${isActive ? "active" : ""}`
    }
>

    {item.icon}

    {!collapsed && <span>{item.title}</span>}

</NavLink>

        ))}

      </div>

      <div className="sidebarBottom">

        <button
          className="collapseBtn"
          onClick={() => setCollapsed(!collapsed)}
        >

          {collapsed ? <ChevronRight /> : <ChevronLeft />}

        </button>

        {!collapsed && (
          <button
  className="logoutBtn"
  onClick={handleLogout}
>

  <LogOut size={21} />

  {!collapsed && <span>Sign out</span>}

</button>
        )}

      </div>

    </div>

  );
}