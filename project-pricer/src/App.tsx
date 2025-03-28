import React from 'react';
import { useProject } from './hooks/useProject';
import { RoleCard } from './components/RoleCard';
import { ProjectSettings } from './components/ProjectSettings';
import { ProjectSummary } from './components/ProjectSummary';
import { CustomerSelection } from './components/CustomerSelection';
import './styles/App.css';

function App() {
  const {
    roles,
    settings,
    selectedCustomer,
    summary,
    updateRole,
    toggleRole,
    updateSettings,
    setSelectedCustomer
  } = useProject();

  return (
    <div className="App">
      <nav className="nav-container">
        <div className="nav-content">
          <img src="/P5TS Logo.png" alt="P5 Tech Solutions Logo" className="nav-logo" />
          <div className="nav-links">
            <a href="/" className="nav-link active">Project Price Calculator</a>
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/projects" className="nav-link">Projects</a>
            <a href="/settings" className="nav-link">Settings</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>Project Price Calculator</h1>
        
        <CustomerSelection
          selectedCustomer={selectedCustomer}
          onCustomerChange={setSelectedCustomer}
        />

        <section className="role-pricing">
          <h2>Role-Based Pricing</h2>
          <div className="role-grid">
            {roles.map(role => (
              <RoleCard
                key={role.id}
                role={role}
                onUpdate={updateRole}
                onToggle={toggleRole}
              />
            ))}
          </div>
        </section>

        <div className="calculator-footer">
          <ProjectSettings
            settings={settings}
            onUpdate={updateSettings}
          />
          <ProjectSummary summary={summary} />
        </div>
      </div>
    </div>
  );
}

export default App;
