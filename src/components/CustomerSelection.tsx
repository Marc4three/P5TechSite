import React, { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';

export const CustomerSelection: React.FC = () => {
  const { state, dispatch } = useProject();
  const { customers, settings } = state;

  useEffect(() => {
    if (settings.selectedCustomer === 'clinovators') {
      const customer = customers.find(c => c.id === 'clinovators');
      if (customer) {
        // Update all roles with Clinovators rates
        dispatch({
          type: 'SET_ROLES',
          payload: state.roles.map(role => ({
            ...role,
            clientRate: customer.defaultClientRate,
            devRate: customer.defaultDevRate,
          })),
        });
      }
    }
  }, [settings.selectedCustomer, customers, dispatch, state.roles]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_CUSTOMER', payload: e.target.value });
  };

  return (
    <div className="customer-selection">
      <div className="input-group">
        <label htmlFor="customer">Select Customer</label>
        <select
          id="customer"
          value={settings.selectedCustomer}
          onChange={handleCustomerChange}
        >
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}; 