import React, { useState, useEffect } from 'react'
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home'
import AccountOverview from './pages/AccountOverview'
import Shop from './pages/Shop'
import ProductDetail from './pages/Shop/ProductDetail'
import Learning from './pages/Learning'
import Services from './pages/Services'
import Login from './pages/Login'
import Blog from './pages/Blog'
import ArticleDetails from './pages/ArticleDetails'
import Templates from './pages/Templates'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminOverview from './pages/Admin/components/AdminOverview'
import UserManagement from './pages/Admin/components/UserManagement'
import ProductManagement from './pages/Admin/components/ProductManagement'
import Analytics from './pages/Admin/components/Analytics'
import SystemSettings from './pages/Admin/components/SystemSettings'
import DataManagement from './pages/Admin/components/DataManagement'
import RoleManagement from './pages/Admin/components/RoleManagement'
import GardenExpertDashboard from './pages/GardenExpertDashboard'
import ArticleEditor from './pages/ArticleEditor'
import { getStoredUser, getStoredToken, clearAuth } from './utils/jwt'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import ProtectedRoute from './routes/ProtectedRoute'
import Wishlist from './pages/Wishlist'
import OrderHistory from './pages/OrderHistory'
import Checkout from './pages/Checkout'

function App() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Initialize user state from localStorage on app load
  useEffect(() => {
    const storedUser = getStoredUser()
    const storedToken = getStoredToken()
    
    if (storedUser && storedToken) {
      setUser(storedUser)
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = '/login'
  }

  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            {/* <Route path="/shop" element={<Shop />} /> */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<ArticleDetails />} />
          <Route path="/templates" element={<Templates />} />

          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/account-overview" element={<AccountOverview />} />


          
          
          {/* Garden Expert Dashboard - role protected */}
          <Route path="/garden-expert/dashboard" element={<ProtectedRoute roles={["garden_expert"]}><GardenExpertDashboard /></ProtectedRoute>} />
          <Route path="/garden-expert/articles/new" element={<ProtectedRoute roles={["garden_expert"]}><ArticleEditor /></ProtectedRoute>} />
          <Route path="/garden-expert/articles/:id/edit" element={<ProtectedRoute roles={["garden_expert"]}><ArticleEditor /></ProtectedRoute>} />

          {/* Registered Customer Dashboard - role protected */}

          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/product/:id" element={<ProductDetail />} />

          <Route path="/cart" element={<ProtectedRoute roles={["registered_customer"]}><Cart /></ProtectedRoute>} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/services" element={<Services />} />

          <Route path="/wishlist" element={<ProtectedRoute roles={["registered_customer"]}><Wishlist /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute roles={["registered_customer"]}><OrderHistory /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} 
          />

          {/* Admin Dashboard - role protected */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} >
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="data" element={<DataManagement />} />
            <Route path="roles" element={<RoleManagement />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  </CartProvider>
  )
}

export default App
