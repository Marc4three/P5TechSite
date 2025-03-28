export interface Role {
    id: string;
    name: string;
    clientRate: number;
    devRate: number;
    hours: number;
    isSelected: boolean;
}

export interface Customer {
    id: string;
    name: string;
    defaultClientRate: number;
    defaultDevRate: number;
}

export interface ProjectSettings {
    selectedCustomer: string;
    profitMargin: number;
    timelinePreference: 'normal' | 'compressed' | 'overtime';
    overtimePremium: number;
    teamCapacity: number;
}

export interface ProjectSummary {
    totalCost: number;
    monthlyRevenue: number;
    totalProfit: number;
    projectDuration: number;
    teamUtilization: number;
} 