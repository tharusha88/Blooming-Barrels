import React from 'react';
import { FaDownload, FaUpload, FaDatabase, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminCard from './AdminCard';

const DataManagement = () => {
  const handleBackup = () => {
    toast.info('Database backup functionality will be implemented');
  };

  const handleRestore = () => {
    toast.info('Database restore functionality will be implemented');
  };

  return (
    <div className="data-management">
      <AdminCard title="Data Management">
        <div className="data-actions">
          <div className="action-section">
            <h3><FaDatabase /> Database Backup</h3>
            <p>Create a backup of your database for safety and recovery purposes.</p>
            <button className="admin-btn" onClick={handleBackup}>
              <FaDownload /> Create Backup
            </button>
          </div>
          
          <div className="action-section">
            <h3><FaUpload /> Database Restore</h3>
            <p>Restore your database from a previous backup file.</p>
            <button className="admin-btn secondary" onClick={handleRestore}>
              <FaUpload /> Restore Backup
            </button>
          </div>
          
          <div className="action-section">
            <h3><FaShieldAlt /> Data Integrity</h3>
            <p>Check and verify the integrity of your database.</p>
            <button className="admin-btn secondary">
              <FaShieldAlt /> Check Integrity
            </button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};

export default DataManagement;
