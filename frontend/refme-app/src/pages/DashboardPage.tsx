import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { linkService } from '../services/api';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';
import '../styles/global.css';

interface Link {
  _id: string;
  title: string;
  url: string;
  category: string;
  privacy: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch links from the API
  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const data = await linkService.getLinks();
      setLinks(data);
    } catch (err: any) {
      addNotification('error', err.response?.data?.msg || 'Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch links on component mount
  useEffect(() => {
    if (user) {
      fetchLinks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = () => {
    logout();
    addNotification('info', 'Logged out successfully');
  };

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dashboard-container">
      <div className="cyber-dots"></div>
      
      <header className="header">
        <h1 className="welcome-text">Welcome, {user}</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </header>
      
      <div className="dashboard-grid">
        <div className="sidebar">
          <LinkForm onLinkAdded={fetchLinks} />
        </div>
        
        <div className="main-content">
          <LinkList links={links} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 