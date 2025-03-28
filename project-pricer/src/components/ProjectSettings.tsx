import React from 'react';
import { ProjectSettingsData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ProjectSettingsProps {
  settings: ProjectSettingsData;
  onUpdate: (updates: Partial<ProjectSettingsData>) => void;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({ settings, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = name === 'timelinePreference' ? value : parseInt(value) || 0;
    onUpdate({ [name]: numValue });
  };

  return (
    <section className="profit-timeline">
      <h2>Profit & Timeline</h2>
      <div className="settings-group">
        <div className="input-group">
          <label>Profit Margin</label>
          <div className="profit-inputs">
            <input
              type="number"
              name="profitMargin"
              value={settings.profitMargin}
              onChange={handleChange}
              min="0"
              max="100"
              disabled
              className="readonly-input"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="monthly-profit">Desired Monthly Profit ($)</label>
          <input
            type="number"
            id="monthly-profit"
            name="monthlyProfit"
            value={settings.monthlyProfit}
            onChange={handleChange}
            min="0"
            step="100"
          />
        </div>
        <div className="input-group">
          <label htmlFor="duration">Project Duration (months)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={settings.duration}
            onChange={handleChange}
            min="1"
          />
        </div>
        <div className="input-group">
          <label htmlFor="timeline-preference">Timeline Preference</label>
          <select
            id="timeline-preference"
            name="timelinePreference"
            value={settings.timelinePreference}
            onChange={handleChange}
          >
            <option value="normal">Normal</option>
            <option value="rush">Rush (1.5×)</option>
            <option value="relaxed">Relaxed (0.9×)</option>
          </select>
        </div>
      </div>
    </section>
  );
}; 