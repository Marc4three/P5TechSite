import React from 'react';
import { Role } from '../types/types';
import { useProject } from '../context/ProjectContext';

interface RoleCardProps {
  role: Role;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  const { dispatch } = useProject();

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_ROLE', payload: role.id });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_ROLE',
      payload: {
        ...role,
        [name]: parseFloat(value) || 0,
      },
    });
  };

  return (
    <div className={`role-card ${role.isSelected ? 'selected' : ''}`}>
      <div className="role-header">
        <h3>{role.name}</h3>
        <label className="toggle">
          <input
            type="checkbox"
            checked={role.isSelected}
            onChange={handleToggle}
          />
          <span className="toggle-slider" />
        </label>
      </div>
      
      <div className="rate-group">
        <div className="input-group">
          <label htmlFor={`${role.id}-client-rate`}>Client Rate</label>
          <input
            type="number"
            id={`${role.id}-client-rate`}
            name="clientRate"
            value={role.clientRate}
            onChange={handleInputChange}
            disabled={!role.isSelected}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor={`${role.id}-dev-rate`}>Dev Rate</label>
          <input
            type="number"
            id={`${role.id}-dev-rate`}
            name="devRate"
            value={role.devRate}
            onChange={handleInputChange}
            disabled={!role.isSelected}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor={`${role.id}-hours`}>Hours</label>
          <input
            type="number"
            id={`${role.id}-hours`}
            name="hours"
            value={role.hours}
            onChange={handleInputChange}
            disabled={!role.isSelected}
          />
        </div>
      </div>
      
      {role.isSelected && (
        <div className="role-total">
          Total: ${(role.clientRate * role.hours).toLocaleString()}
        </div>
      )}
    </div>
  );
}; 