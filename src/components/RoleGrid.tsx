import React from 'react';
import { RoleCard } from './RoleCard';
import { useProject } from '../context/ProjectContext';
import { useCalculations } from '../hooks/useCalculations';

export const RoleGrid: React.FC = () => {
  const { state } = useProject();
  
  // Initialize calculations
  useCalculations();

  return (
    <section className="role-pricing">
      <h2>Role Selection</h2>
      <div className="role-grid">
        {state.roles.map(role => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </section>
  );
}; 