export interface Role {
  id: string;
  title: string;
  clientRate: number;
  devRate: number;
  hours: number;
  isMyRole: boolean;
  total: number;
}

export interface ProjectSettingsData {
  profitMargin: number;
  monthlyProfit: number;
  duration: number;
  timelinePreference: 'normal' | 'rush' | 'relaxed';
}

export interface ProjectSummaryData {
  totalProjectCost: number;
  monthlyCustomerPayment: number;
  monthlyTeamPayout: number;
  myMonthlyProfit: number;
  myMonthlyRevenue: number;
}

export interface CustomerRates {
  clinovators: {
    [key: string]: {
      clientRate: number;
      devRate: number;
    };
  };
  custom: {
    [key: string]: {
      clientRate: number;
      devRate: number;
    };
  };
} 