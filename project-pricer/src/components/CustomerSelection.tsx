import React from 'react';

interface CustomerSelectionProps {
  selectedCustomer: 'clinovators' | 'custom';
  onCustomerChange: (customer: 'clinovators' | 'custom') => void;
}

export const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  selectedCustomer,
  onCustomerChange
}) => {
  return (
    <section className="customer-selection">
      <div className="input-group">
        <label htmlFor="customer-select">Select Customer</label>
        <select
          id="customer-select"
          value={selectedCustomer}
          onChange={(e) => onCustomerChange(e.target.value as 'clinovators' | 'custom')}
        >
          <option value="clinovators">Clinovators</option>
          <option value="custom">Custom Rates</option>
        </select>
      </div>
    </section>
  );
}; 