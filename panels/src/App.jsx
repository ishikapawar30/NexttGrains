import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
BrowserRouter,
Routes,
Route,
Navigate 
} from "react-router-dom";

/* ================= ADMIN ================= */
import AdminLogin from "./components/Admin/AdminLogin";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminSidebar from "./components/Admin/AdminSidebar";
import AdminNavbar from "./components/Admin/AdminNavbar";
import Customers from "./pages/Admin/Customer";
import OrderManagement from "./pages/Admin/OrderManagement";
import CouponManagement from "./pages/Admin/CouponManagement";
import BlogsManagement from "./pages/Admin/BlogsManagement";
import FinanceManagement from "./pages/Admin/FinanceManagement";
import Report from "./pages/Admin/Report";
import ProductManagement from "./pages/Admin/ProductManagement";
import VendorManagement from "./pages/Admin/VendorManagement";
import WebsiteContent from "./pages/Admin/WebsiteContent";

/* ================= VENDOR ================= */
import VendorSidebar from "./components/Vendor/VendorSidebar";
import VendorLogin from "./components/Vendor/VendorLogin";
import VendorSignup from "./components/Vendor/VendorSignup";
import VendorDashboard from "./pages/Vendor/VendorDashboard";
import Products from "./pages/Vendor/Products";
import AddProducts from "./pages/Vendor/AddProducts";
import ProfileManagement from "./pages/Vendor/ProfileManagement";
import Order from "./pages/Vendor/Order";
import VendorReport from "./pages/Vendor/Report";

function App(){

return(

<BrowserRouter>

<Routes>



{/* ================= ADMIN ================= */}
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
path="/admin"
element={<Navigate to="/admin/customers" replace />}
/>
<Route
  path="/admin/customers"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <Customers />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/products"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <ProductManagement />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/orders"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <OrderManagement />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/coupons"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <CouponManagement />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/blogs"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <BlogsManagement />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/website-content"
  element={
    <AdminProtectedRoute>
      <AdminSidebar />
      <AdminNavbar />

      <WebsiteContent />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/finance"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <FinanceManagement />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>
<Route
  path="/admin/reports"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <Report />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/vendors"
  element={
    <AdminProtectedRoute>
    <div className="ngAdminLayout">
      <AdminSidebar />
      <div className="ngAdminRight">
        <AdminNavbar />
        <div className="ngAdminMainContent">
          <VendorManagement />
        </div>
      </div>
    </div>
    </AdminProtectedRoute>
  }
/>

{/* VENDOR  */}
{/* ================= VENDOR AUTH ================= */}

<Route

path="/vendor/login"

element={<VendorLogin/>}

/>

<Route

path="/vendor/signup"

element={<VendorSignup/>}

/>


{/* ================= VENDOR DASHBOARD ================= */}

<Route

path="/vendor/dashboard"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<VendorDashboard/>

</div>

</div>

}

/>


{/* ================= PRODUCTS ================= */}

<Route

path="/vendor/products"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<Products/>

</div>

</div>

}

/>


{/* ================= ADD PRODUCT ================= */}

<Route

path="/vendor/products/add"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<AddProducts/>

</div>

</div>

}

/>
<Route

path="/vendor/products/edit/:id"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<AddProducts/>

</div>

</div>

}

/>

{/* ================= PROFILE MANAGEMENT ================= */}

<Route

path="/vendor/profile"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<ProfileManagement/>

</div>

</div>

}

/>

{/* ================= VENDOR ORDERS ================= */}

<Route

path="/vendor/orders"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<Order/>

</div>

</div>

}

/>

{/* ================= VENDOR REPORTS ================= */}

<Route

path="/vendor/reports"

element={

<div className="ngVendorLayout">

<VendorSidebar/>

<div className="ngVendorRight">

<VendorReport/>

</div>

</div>

}

/>

</Routes>
<ToastContainer
      position="top-right"
      autoClose={2500}
      theme="colored"
   />
</BrowserRouter>

);

}

export default App;