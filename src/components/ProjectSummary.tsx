import React from 'react';
import { useProject } from '../context/ProjectContext';

export const ProjectSummary: React.FC = () => {
  const { state } = useProject();
  const { summary } = state;

  return (
    <section className="project-summary">
      <h2>Project Summary</h2>
      <div className="summary-grid">
        <div className="summary-item main-highlight">
          <label>Total Project Revenue</label>
          <span>${summary.totalProfit.toLocaleString()}</span>
          <div className="monthly-breakdown">
            ${summary.monthlyRevenue.toLocaleString()} / month
          </div>
        </div>

        <div className="summary-item">
          <label>Total Cost</label>
          <span>${summary.totalCost.toLocaleString()}</span>
        </div>

        <div className="summary-item">
          <label>Project Duration</label>
          <span>{summary.projectDuration.toFixed(1)} months</span>
        </div>

        <div className="summary-item">
          <label>Team Utilization</label>
          <span>{summary.teamUtilization.toFixed(1)}%</span>
        </div>
      </div>
    </section>
  );
}; 