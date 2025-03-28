import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Role, Customer, ProjectSettings, ProjectSummary } from '../types/types';

interface State {
  roles: Role[];
  customers: Customer[];
  settings: ProjectSettings;
  summary: ProjectSummary;
}

type Action =
  | { type: 'SET_ROLES'; payload: Role[] }
  | { type: 'UPDATE_ROLE'; payload: Role }
  | { type: 'TOGGLE_ROLE'; payload: string }
  | { type: 'SET_CUSTOMER'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ProjectSettings> }
  | { type: 'UPDATE_SUMMARY'; payload: ProjectSummary };

const initialState: State = {
  roles: [
    { id: 'pm', name: 'Project Management', clientRate: 60, devRate: 50, hours: 40, isSelected: true },
    { id: 'frontend', name: 'Frontend Development', clientRate: 60, devRate: 50, hours: 120, isSelected: true },
    { id: 'backend', name: 'Backend Development', clientRate: 60, devRate: 50, hours: 160, isSelected: false },
    { id: 'uiux', name: 'UI/UX Design', clientRate: 60, devRate: 50, hours: 80, isSelected: false },
    { id: 'devops', name: 'Architecture/DevOps', clientRate: 60, devRate: 50, hours: 40, isSelected: true },
    { id: 'qa', name: 'QA/Testing', clientRate: 60, devRate: 50, hours: 60, isSelected: false },
    { id: 'support', name: 'Customer Support/Training', clientRate: 60, devRate: 50, hours: 40, isSelected: true },
  ],
  customers: [
    { id: 'clinovators', name: 'Clinovators', defaultClientRate: 60, defaultDevRate: 50 },
    { id: 'custom', name: 'Custom Rates', defaultClientRate: 0, defaultDevRate: 0 },
  ],
  settings: {
    selectedCustomer: 'clinovators',
    profitMargin: 20,
    timelinePreference: 'normal',
    overtimePremium: 50,
    teamCapacity: 100,
  },
  summary: {
    totalCost: 0,
    monthlyRevenue: 0,
    totalProfit: 0,
    projectDuration: 0,
    teamUtilization: 0,
  },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ROLES':
      return { ...state, roles: action.payload };
    case 'UPDATE_ROLE':
      return {
        ...state,
        roles: state.roles.map(role =>
          role.id === action.payload.id ? action.payload : role
        ),
      };
    case 'TOGGLE_ROLE':
      return {
        ...state,
        roles: state.roles.map(role =>
          role.id === action.payload ? { ...role, isSelected: !role.isSelected } : role
        ),
      };
    case 'SET_CUSTOMER':
      return {
        ...state,
        settings: { ...state.settings, selectedCustomer: action.payload },
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload };
    default:
      return state;
  }
};

const ProjectContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}; 