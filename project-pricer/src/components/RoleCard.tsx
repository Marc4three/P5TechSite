import React from 'react';
import { Role } from '../types';
import { formatCurrency } from '../utils/formatters';

interface RoleCardProps {
  role: Role;
  onUpdate: (roleId: string, updates: Partial<Role>) => void;
  onToggle: (roleId: string) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onUpdate, onToggle }) => {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(e.target.value) || 0;
    const total = hours * (role.isMyRole ? role.devRate : role.clientRate);
    onUpdate(role.id, { hours, total });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'clientRate' | 'devRate') => {
    const rate = parseInt(e.target.value) || 0;
    const total = role.hours * (role.isMyRole ? (type === 'devRate' ? rate : role.devRate) : (type === 'clientRate' ? rate : role.clientRate));
    onUpdate(role.id, { [type]: rate, total });
  };

  return (
    <div className={`role-card ${role.isMyRole ? 'selected' : ''}`}>
      <h3>{role.title}</h3>
      <div className="rate-group">
        <div className="input-group">
          <label htmlFor={`${role.id}-client-rate`}>Client Rate ($)</label>
          <input
            type="number"
            id={`${role.id}-client-rate`}
            value={role.clientRate}
            onChange={(e) => handleRateChange(e, 'clientRate')}
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor={`${role.id}-dev-rate`}>Developer Rate ($)</label>
          <input
            type="number"
            id={`${role.id}-dev-rate`}
            value={role.devRate}
            onChange={(e) => handleRateChange(e, 'devRate')}
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor={`${role.id}-hours`}>Hours</label>
          <input
            type="number"
            id={`${role.id}-hours`}
            value={role.hours}
            onChange={handleHoursChange}
            min="0"
          />
        </div>
      </div>
      <div className="role-toggle">
        <label className="toggle">
          <input
            type="checkbox"
            checked={role.isMyRole}
            onChange={() => onToggle(role.id)}
          />
          My Role
        </label>
        <span className="role-total">{formatCurrency(role.total)}</span>
      </div>
    </div>
  );
}; 