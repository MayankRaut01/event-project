// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventsList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import EventBooking from './pages/EventBooking';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import BookingResultPage from './pages/BookingResultPage';
import MyBookings from './pages/MyBooking';
import BookingSuccess from './pages/BookingSuccess';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            
            {/* User routes */}
            <Route path="/my-bookings" element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Organizer routes */}
            <Route path="/events/create" element={
              <PrivateRoute organizerOnly={true}>
                <CreateEvent />
              </PrivateRoute>
            } />
            <Route path="/events/edit/:id" element={
              <PrivateRoute organizerOnly={true}>
                <EditEvent />
              </PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/categories" element={
              <PrivateRoute adminOnly={true}>
                <CategoryManagement />
              </PrivateRoute>
            } />
            
            {/* Booking and payment routes */}
            <Route path="/events/:id/book" element={<EventBooking />} />
            <Route path="/payment/:bookingId" element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            } />
            <Route path="/payment/success/:bookingId" element={
              <PrivateRoute>
                <PaymentSuccess />
              </PrivateRoute>
            } />
            <Route path="/booking-result" element={
              <PrivateRoute>
                <BookingResultPage />
              </PrivateRoute>
            } />
            <Route path="/booking-success" element={<BookingSuccess />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;