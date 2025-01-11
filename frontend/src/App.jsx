import React from 'react'
import FloatingShape from './components/FloatingShape'
import EmailVerification from './pages/EmailVerification'
import {Navigate, Routes, Route } from 'react-router-dom'
import DashboardPage from "./pages/Dashboard";
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'





const App = () => {
  const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user.isVerified) {
      return <Navigate to='/' replace />;
    }

    return children;
  };
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
  
    if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
    }
  
    if (!user.isVerified) {
      return <Navigate to='/verify-email' replace />;
    }
  
    return children;
  };
  const { isCheckingAuth, checkAuth, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isAuthenticated) {
    console.log(user);

  }


  return (
    <div
      className='min-h-screen bg-green-500 text-green-400 from-green-600 via-green-800 to-emerald-900 flex items-center justify-center relative overflow-hidden'
    // Ensure container takes full viewport height
    >
      <FloatingShape
        color='bg-green-600'  // Brighter green
        size='w-64 h-64'
        top='-5%'
        left='10%'
        delay={0}
      />
      <FloatingShape
        color='bg-emerald-800'  // Brighter emerald
        size='w-48 h-48'
        top='70%'
        left='80%'
        delay={5}
      />
      <FloatingShape
        color='bg-lime-800'
        size='w-32 h-32'
        top='40%'
        left='-10%'
        delay={2}
      />
      <Routes>
        {/* Add your routes here */}
        <Route path='/' element={<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>} />
        <Route path='/signup' element={<RedirectAuthenticatedUser>
							<Signup />
						</RedirectAuthenticatedUser>} />
        <Route path='/login' element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
        <Route path='/verify-email' element={<EmailVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset/:token' element={<ResetPassword />} />




      </Routes>
    </div>

  )
}

export default App

