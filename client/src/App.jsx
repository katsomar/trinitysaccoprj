import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SaverDashboard from './pages/SaverDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import GroupView from './pages/GroupView';
import Chat from './pages/Chat';
import CustomerService from './pages/CustomerService';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import ManagerNotifications from './pages/ManagerNotifications';
import ManagerSettings from './pages/ManagerSettings';
import Invites from './pages/Invites';
import InviteManager from './pages/InviteManager';

// Helper to conditionally render Navbar/Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const showLayout = [
    "/",
    "/about",
    "/login",
    "/signup",
    "/customer-service",
  ].includes(location.pathname);

  return (
    <div className="app">
      {showLayout && <Navbar />}
      <main>{children}</main>
      {showLayout && <Footer />}
    </div>
  );
};

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/saver-dashboard" element={<SaverDashboard />} />
                    <Route path="/saver-dashboard/deposit" element={<SaverDashboard />} />
                    <Route path="/saver-dashboard/withdraw" element={<SaverDashboard />} />
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager-notifications" element={<ManagerNotifications />} />
                    <Route path="/manager-settings" element={<ManagerSettings />} />
                    <Route path="/groups" element={<GroupView />} />
                    <Route path="/group/:groupId" element={<GroupView />} />
                    <Route path="/invites" element={<Invites />} />
                    <Route path="/invite-manager" element={<InviteManager />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chat/:groupId" element={<Chat />} />
                    <Route path="/customer-service" element={<CustomerService />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
