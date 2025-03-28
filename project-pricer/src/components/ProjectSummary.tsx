import React from 'react';
import { ProjectSummaryData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProjectSummaryProps {
  summary: ProjectSummaryData;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ summary }) => {
  return (
    <section className="project-summary">
      <h2>Project Summary</h2>
      <div className="summary-grid">
        <div className="summary-item highlight main-highlight">
          <label>Total Project Cost</label>
          <span>{formatCurrency(summary.totalProjectCost)}</span>
          <small className="monthly-breakdown">Complete project cost including all roles and profit</small>
        </div>
        <div className="summary-subgrid">
          <div className="summary-item">
            <label>Monthly Customer Payment</label>
            <span>{formatCurrency(summary.monthlyCustomerPayment)}</span>
            <small className="monthly-breakdown">Client pays this amount monthly</small>
          </div>
          <div className="summary-item">
            <label>Monthly Team Payout</label>
            <span>{formatCurrency(summary.monthlyTeamPayout)}</span>
            <small className="monthly-breakdown">Team member costs per month</small>
          </div>
          <div className="summary-item">
            <label>My Monthly Profit</label>
            <span>{formatCurrency(summary.myMonthlyProfit)}</span>
            <small className="monthly-breakdown">Revenue + Profit Margin</small>
          </div>
          <div className="summary-item">
            <label>My Monthly Revenue</label>
            <span>{formatCurrency(summary.myMonthlyRevenue)}</span>
            <small className="monthly-breakdown">From my assigned roles</small>
          </div>
        </div>
      </div>
    </section>
  );
}; 