import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import { DashboardStats, RecentActivity } from '../../components';
import { getDashboardStats } from '../../services/api/dashboardService'; // 👈 new file

const DashboardPage = () => {
  const [stats, setStats] = useState({ cases: 0, documents: 0, analyses: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats(); // fetch from backend
        setStats({
          cases: data.cases || 0,
          documents: data.documents || 0,
          analyses: data.analyses || 0,
        });
        setRecent(data.recent || []);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <DashboardStats stats={stats} />
          <RecentActivity recent={recent} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
