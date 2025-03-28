import { useState, useEffect } from 'react';
import { Role, ProjectSettingsData, ProjectSummaryData, CustomerRates } from '../types';

const initialRoles: Role[] = [
  {
    id: 'backend',
    title: 'Backend Development',
    clientRate: 100,
    devRate: 85,
    hours: 0,
    isMyRole: false,
    total: 0
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    clientRate: 90,
    devRate: 75,
    hours: 0,
    isMyRole: false,
    total: 0
  },
  {
    id: 'ui',
    title: 'UI/UX Design',
    clientRate: 85,
    devRate: 70,
    hours: 0,
    isMyRole: false,
    total: 0
  },
  {
    id: 'pm',
    title: 'Project Management & Business Analysis',
    clientRate: 80,
    devRate: 80,
    hours: 0,
    isMyRole: false,
    total: 0
  },
  {
    id: 'devops',
    title: 'Architecture/DevOps',
    clientRate: 110,
    devRate: 110,
    hours: 0,
    isMyRole: false,
    total: 0
  },
  {
    id: 'qa',
    title: 'QA / Testing',
    clientRate: 75,
    devRate: 60,
    hours: 0,
    isMyRole: false,
    total: 0
  },
  {
    id: 'support',
    title: 'Customer Support / Training',
    clientRate: 70,
    devRate: 70,
    hours: 0,
    isMyRole: false,
    total: 0
  }
];

const initialSettings: ProjectSettingsData = {
  profitMargin: 20,
  monthlyProfit: 5000,
  duration: 1,
  timelinePreference: 'normal'
};

const customerRates: CustomerRates = {
  clinovators: {
    backend: { clientRate: 100, devRate: 85 },
    frontend: { clientRate: 90, devRate: 75 },
    ui: { clientRate: 85, devRate: 70 },
    pm: { clientRate: 80, devRate: 80 },
    devops: { clientRate: 110, devRate: 110 },
    qa: { clientRate: 75, devRate: 60 },
    support: { clientRate: 70, devRate: 70 }
  },
  custom: {
    backend: { clientRate: 100, devRate: 85 },
    frontend: { clientRate: 90, devRate: 75 },
    ui: { clientRate: 85, devRate: 70 },
    pm: { clientRate: 80, devRate: 80 },
    devops: { clientRate: 110, devRate: 110 },
    qa: { clientRate: 75, devRate: 60 },
    support: { clientRate: 70, devRate: 70 }
  }
};

export const useProject = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [settings, setSettings] = useState<ProjectSettingsData>(initialSettings);
  const [selectedCustomer, setSelectedCustomer] = useState<'clinovators' | 'custom'>('clinovators');
  const [summary, setSummary] = useState<ProjectSummaryData>({
    totalProjectCost: 0,
    monthlyCustomerPayment: 0,
    monthlyTeamPayout: 0,
    myMonthlyProfit: 0,
    myMonthlyRevenue: 0
  });

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === roleId ? { ...role, ...updates } : role
      )
    );
  };

  const toggleRole = (roleId: string) => {
    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === roleId ? { ...role, isMyRole: !role.isMyRole } : role
      )
    );
  };

  const updateSettings = (updates: Partial<ProjectSettingsData>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const calculateSummary = () => {
    const selectedRoles = roles.filter(role => role.isMyRole);
    const totalProjectCost = roles.reduce((sum, role) => sum + role.total, 0);
    const monthlyCustomerPayment = totalProjectCost / settings.duration;
    const monthlyTeamPayout = roles.reduce((sum, role) => 
      sum + (role.isMyRole ? role.total / settings.duration : 0), 0);
    const myMonthlyProfit = monthlyCustomerPayment * (settings.profitMargin / 100);
    const myMonthlyRevenue = monthlyCustomerPayment + myMonthlyProfit;

    setSummary({
      totalProjectCost,
      monthlyCustomerPayment,
      monthlyTeamPayout,
      myMonthlyProfit,
      myMonthlyRevenue
    });
  };

  useEffect(() => {
    calculateSummary();
  }, [roles, settings]);

  useEffect(() => {
    setRoles(prevRoles =>
      prevRoles.map(role => ({
        ...role,
        clientRate: customerRates[selectedCustomer][role.id].clientRate,
        devRate: customerRates[selectedCustomer][role.id].devRate
      }))
    );
  }, [selectedCustomer]);

  return {
    roles,
    settings,
    selectedCustomer,
    summary,
    updateRole,
    toggleRole,
    updateSettings,
    setSelectedCustomer
  };
}; 