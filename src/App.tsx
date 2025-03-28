import React from 'react';
import { ProjectProvider } from './context/ProjectContext';
import Header from './components/Header';
import CustomerSelection from './components/CustomerSelection';
import RoleGrid from './components/RoleGrid';
import ProjectSettings from './components/ProjectSettings';
import ProjectSummary from './components/ProjectSummary';
import './styles/App.css';

function App() {
  return (
    <ProjectProvider>
      <div className="container">
        <Header />
        <CustomerSelection />
        <RoleGrid />
        <div className="calculator-footer">
          <ProjectSettings />
          <ProjectSummary />
        </div>
      </div>
    </ProjectProvider>
  );
}

export default App; 