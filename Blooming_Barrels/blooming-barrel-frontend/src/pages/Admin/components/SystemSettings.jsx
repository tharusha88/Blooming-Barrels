import React, { useState } from 'react';
import { FaSave, FaKey, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminCard from './AdminCard';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    apiKeys: {
      openai: '',
      stripe: '',
      emailService: ''
    },
    limits: {
      maxUsers: 1000,
      maxProducts: 500,
      apiCallsPerHour: 1000
    },
    general: {
      siteName: 'Blooming Barrels',
      maintenanceMode: false,
      allowRegistration: true
    }
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="system-settings">
      <AdminCard title="System Settings">
        <div className="settings-section">
          <h3><FaKey /> API Keys</h3>
          <div className="admin-form">
            <div className="form-group">
              <label>OpenAI API Key</label>
              <input
                type="password"
                value={settings.apiKeys.openai}
                onChange={(e) => setSettings({
                  ...settings,
                  apiKeys: { ...settings.apiKeys, openai: e.target.value }
                })}
                placeholder="sk-..."
              />
            </div>
            <div className="form-group">
              <label>Stripe API Key</label>
              <input
                type="password"
                value={settings.apiKeys.stripe}
                onChange={(e) => setSettings({
                  ...settings,
                  apiKeys: { ...settings.apiKeys, stripe: e.target.value }
                })}
                placeholder="sk_test_..."
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3><FaCog /> General Settings</h3>
          <div className="admin-form">
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, siteName: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: e.target.checked }
                  })}
                />
                Maintenance Mode
              </label>
            </div>
          </div>
        </div>

        <button className="admin-btn" onClick={handleSave}>
          <FaSave /> Save Settings
        </button>
      </AdminCard>
    </div>
  );
};

export default SystemSettings;
