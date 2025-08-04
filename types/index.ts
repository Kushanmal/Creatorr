export type Currency = "LKR" | "USD";

export type ProjectStatus = "ongoing" | "completed" | "overdue";

export type ServiceType = 
  | "Web Development" 
  | "Mobile App" 
  | "UI/UX Design" 
  | "Graphic Design" 
  | "Logo Design" 
  | "Branding" 
  | "Content Creation" 
  | "Other";

export interface Project {
  id: string;
  title: string;
  description: string;
  notes: string;
  clientId: string;
  invoiceNumber: string;
  serviceType: ServiceType;
  price: number;
  currency: Currency;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  status: ProjectStatus;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  website?: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  totalIncome: number;
  monthlyIncome: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    colors?: string[];
  }[];
}

export interface ReportPeriod {
  startDate: string;
  endDate: string;
  label: string;
}

export interface Report {
  period: ReportPeriod;
  totalProjects: number;
  completedProjects: number;
  totalIncome: number;
  projectBreakdown: {
    serviceType: ServiceType;
    count: number;
    income: number;
  }[];
  clientBreakdown: {
    clientId: string;
    clientName: string;
    projectCount: number;
    income: number;
  }[];
}