import React from 'react';
import { useProject } from '../context/ProjectContext';

export const ProjectSettings: React.FC = () => {
  const { state, dispatch } = useProject();
  const { settings } = state;

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        [name]: name === 'timelinePreference' ? value : parseFloat(value) || 0,
      },
    });
  };

  return (
    <section className="project-settings">
      <h2>Project Settings</h2>
      <div className="settings-group">
        <div className="input-group">
          <label htmlFor="profitMargin">Profit Margin (%)</label>
          <div className="profit-inputs">
            <input
              type="number"
              id="profitMargin"
              name="profitMargin"
              value={settings.profitMargin}
              onChange={handleSettingChange}
              min="0"
              max="100"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="timeline-preference">Timeline Preference</label>
          <select
            id="timeline-preference"
            name="timelinePreference"
            value={settings.timelinePreference}
            onChange={handleSettingChange}
          >
            <option value="normal">Normal</option>
            <option value="compressed">Compressed (30% faster)</option>
            <option value="overtime">Overtime</option>
          </select>
          <div className="input-help">
            Affects project duration and costs
          </div>
        </div>

        {settings.timelinePreference === 'overtime' && (
          <div className="input-group" id="overtime-premium-group">
            <label htmlFor="overtimePremium">Overtime Premium (%)</label>
            <div className="profit-inputs">
              <input
                type="number"
                id="overtimePremium"
                name="overtimePremium"
                value={settings.overtimePremium}
                onChange={handleSettingChange}
                min="0"
                max="100"
              />
              <span className="input-suffix">%</span>
            </div>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="teamCapacity">Team Capacity (%)</label>
          <div className="profit-inputs">
            <input
              type="number"
              id="teamCapacity"
              name="teamCapacity"
              value={settings.teamCapacity}
              onChange={handleSettingChange}
              min="0"
              max="100"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>
      </div>
    </section>
  );
}; 