import { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { ProjectSummary } from '../types/types';

export const useCalculations = () => {
  const { state, dispatch } = useProject();
  const { roles, settings } = state;

  useEffect(() => {
    const selectedRoles = roles.filter(role => role.isSelected);
    const totalHours = selectedRoles.reduce((sum, role) => sum + role.hours, 0);
    
    // Calculate base costs and revenue
    const totalCost = selectedRoles.reduce((sum, role) => sum + (role.devRate * role.hours), 0);
    const totalRevenue = selectedRoles.reduce((sum, role) => sum + (role.clientRate * role.hours), 0);
    
    // Adjust for timeline preference
    let timelineMultiplier = 1;
    let costMultiplier = 1;
    
    switch (settings.timelinePreference) {
      case 'compressed':
        timelineMultiplier = 0.7;
        costMultiplier = 1.3;
        break;
      case 'overtime':
        timelineMultiplier = 0.8;
        costMultiplier = 1 + (settings.overtimePremium / 100);
        break;
    }

    // Calculate project duration (in months)
    const hoursPerMonth = 160; // Assuming 40 hours/week * 4 weeks
    const projectDuration = (totalHours / hoursPerMonth) * timelineMultiplier;
    
    // Calculate team utilization
    const teamUtilization = Math.min(100, (totalHours / (hoursPerMonth * projectDuration)) * 100);
    
    // Calculate adjusted costs and revenue
    const adjustedCost = totalCost * costMultiplier;
    const monthlyRevenue = totalRevenue / projectDuration;
    const totalProfit = totalRevenue - adjustedCost;

    const summary: ProjectSummary = {
      totalCost: adjustedCost,
      monthlyRevenue,
      totalProfit,
      projectDuration,
      teamUtilization,
    };

    dispatch({ type: 'UPDATE_SUMMARY', payload: summary });
  }, [roles, settings, dispatch]);
}; 