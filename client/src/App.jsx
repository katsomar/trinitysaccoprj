import React, { useState } from 'react';
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
import ManagerChat from './pages/ManagerChat';
import ManagerDiscover from './pages/ManagerDiscover';
import ManagerTransactions from './pages/ManagerTransactions';
import Members from './pages/Members';
import SaverDiscover from './pages/SaverDiscover';
import CustomerService from './pages/CustomerService';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import ManagerNotifications from './pages/ManagerNotifications';
import ManagerSettings from './pages/ManagerSettings';
import Invites from './pages/Invites';
import InviteManager from './pages/InviteManager';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import SplashScreen from './components/SplashScreen';

// Helper to conditionally render Navbar/Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const showLayout = [
    "/",
    "/home",
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
    const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashShown'));
    return (
        <Router>
            {showSplash && <SplashScreen onFinish={() => { sessionStorage.setItem('splashShown', '1'); setShowSplash(false); }} />}
            {!showSplash && (
              <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/saver-dashboard" element={<SaverDashboard />} />
                    <Route path="/saver-dashboard/deposit" element={<SaverDashboard />} />
                    <Route path="/saver-dashboard/withdraw" element={<SaverDashboard />} />
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                    <Route path="/manager-notifications" element={<ManagerNotifications />} />
                    <Route path="/manager-settings" element={<ManagerSettings />} />
                    <Route path="/manager-transactions" element={<ManagerTransactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/groups" element={<GroupView />} />
                    <Route path="/group/:groupId" element={<GroupView />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/invites" element={<Invites />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/invite-manager" element={<InviteManager />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chat/:groupId" element={<Chat />} />
                    <Route path="/manager-chat" element={<ManagerChat />} />
                    <Route path="/manager-discover" element={<ManagerDiscover />} />
                    <Route path="/discover" element={<SaverDiscover />} />
                    <Route path="/customer-service" element={<CustomerService />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </Layout>
            )}
        </Router>
    );
};

export default App;
