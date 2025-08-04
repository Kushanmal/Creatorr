import { format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import { Project, Client, Currency, ProjectStatus, ChartData, Report, ReportPeriod } from "@/types";

// Format date for display
export const formatDate = (dateString: string, formatStr: string = "MMM d, yyyy") => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Format currency for display
export const formatCurrency = (amount: number, currency: Currency) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

// Calculate project status based on dates
export const calculateProjectStatus = (project: Project): ProjectStatus => {
  const today = new Date();
  const dueDate = parseISO(project.dueDate);
  
  if (project.completedDate) {
    return "completed";
  }
  
  if (isAfter(today, dueDate)) {
    return "overdue";
  }
  
  return "ongoing";
};

// Get client name by ID
export const getClientNameById = (clientId: string, clients: Client[]): string => {
  const client = clients.find((c) => c.id === clientId);
  return client ? client.name : "Unknown Client";
};

// Calculate dashboard statistics
export const calculateDashboardStats = (projects: Project[], currency: Currency) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "ongoing").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const overdueProjects = projects.filter((p) => p.status === "overdue").length;
  
  let totalIncome = 0;
  let monthlyIncome = 0;
  
  projects.forEach((project) => {
    // Convert all amounts to the selected currency for consistency
    const projectAmount = project.currency === currency 
      ? project.price 
      : convertAmount(project.price, project.currency, currency);
    
    if (project.status === "completed") {
      totalIncome += projectAmount;
      
      // Check if completed this month
      if (project.completedDate && isAfter(parseISO(project.completedDate), startOfMonth)) {
        monthlyIncome += projectAmount;
      }
    }
  });
  
  return {
    totalProjects,
    activeProjects,
    completedProjects,
    overdueProjects,
    totalIncome,
    monthlyIncome,
  };
};

// Simple currency conversion (for demo purposes)
export const convertAmount = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) return amount;
  
  // Using a fixed exchange rate for demo purposes
  const exchangeRate = 320; // 1 USD = 320 LKR
  
  if (from === "USD" && to === "LKR") {
    return amount * exchangeRate;
  } else {
    return amount / exchangeRate;
  }
};

// Generate chart data for project status
export const generateStatusChartData = (projects: Project[]): ChartData => {
  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const completed = projects.filter((p) => p.status === "completed").length;
  const overdue = projects.filter((p) => p.status === "overdue").length;
  
  return {
    labels: ["Ongoing", "Completed", "Overdue"],
    datasets: [
      {
        data: [ongoing, completed, overdue],
        colors: ["#FFC107", "#4CAF50", "#F44336"],
      },
    ],
  };
};

// Generate chart data for monthly income
export const generateMonthlyIncomeData = (projects: Project[], currency: Currency): ChartData => {
  // Get last 6 months
  const today = new Date();
  const labels: string[] = [];
  const data: number[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(format(month, "MMM"));
    
    const monthIncome = projects
      .filter((p) => {
        if (!p.completedDate) return false;
        const completedDate = parseISO(p.completedDate);
        return completedDate.getMonth() === month.getMonth() && 
               completedDate.getFullYear() === month.getFullYear();
      })
      .reduce((sum, project) => {
        const amount = project.currency === currency 
          ? project.price 
          : convertAmount(project.price, project.currency, currency);
        return sum + amount;
      }, 0);
    
    data.push(monthIncome);
  }
  
  return {
    labels,
    datasets: [{ data }],
  };
};

// Generate a report for a specific period
export const generateReport = (
  projects: Project[],
  clients: Client[],
  period: ReportPeriod,
  currency: Currency
): Report => {
  const startDate = parseISO(period.startDate);
  const endDate = parseISO(period.endDate);
  
  // Filter projects in the period
  const periodProjects = projects.filter((project) => {
    if (!project.completedDate) return false;
    const completedDate = parseISO(project.completedDate);
    return isAfter(completedDate, startDate) && isBefore(completedDate, endDate);
  });
  
  // Calculate total income
  const totalIncome = periodProjects.reduce((sum, project) => {
    const amount = project.currency === currency 
      ? project.price 
      : convertAmount(project.price, project.currency, currency);
    return sum + amount;
  }, 0);
  
  // Group by service type
  const serviceTypeMap = new Map<string, { count: number; income: number }>();
  periodProjects.forEach((project) => {
    const amount = project.currency === currency 
      ? project.price 
      : convertAmount(project.price, project.currency, currency);
    
    if (serviceTypeMap.has(project.serviceType)) {
      const current = serviceTypeMap.get(project.serviceType)!;
      serviceTypeMap.set(project.serviceType, {
        count: current.count + 1,
        income: current.income + amount,
      });
    } else {
      serviceTypeMap.set(project.serviceType, { count: 1, income: amount });
    }
  });
  
  // Group by client
  const clientMap = new Map<string, { count: number; income: number }>();
  periodProjects.forEach((project) => {
    const amount = project.currency === currency 
      ? project.price 
      : convertAmount(project.price, project.currency, currency);
    
    if (clientMap.has(project.clientId)) {
      const current = clientMap.get(project.clientId)!;
      clientMap.set(project.clientId, {
        count: current.count + 1,
        income: current.income + amount,
      });
    } else {
      clientMap.set(project.clientId, { count: 1, income: amount });
    }
  });
  
  // Format the report
  return {
    period,
    totalProjects: periodProjects.length,
    completedProjects: periodProjects.filter((p) => p.status === "completed").length,
    totalIncome,
    projectBreakdown: Array.from(serviceTypeMap.entries()).map(([serviceType, data]) => ({
      serviceType: serviceType as any,
      count: data.count,
      income: data.income,
    })),
    clientBreakdown: Array.from(clientMap.entries()).map(([clientId, data]) => ({
      clientId,
      clientName: getClientNameById(clientId, clients),
      projectCount: data.count,
      income: data.income,
    })),
  };
};

// Generate predefined report periods
export const getReportPeriods = (): ReportPeriod[] => {
  const today = new Date();
  
  // This week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  // This month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Last month
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
  // This year
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  
  // Last year
  const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(today.getFullYear(), 0, 0);
  
  return [
    {
      startDate: startOfWeek.toISOString(),
      endDate: today.toISOString(),
      label: "This Week",
    },
    {
      startDate: startOfMonth.toISOString(),
      endDate: today.toISOString(),
      label: "This Month",
    },
    {
      startDate: startOfLastMonth.toISOString(),
      endDate: endOfLastMonth.toISOString(),
      label: "Last Month",
    },
    {
      startDate: startOfYear.toISOString(),
      endDate: today.toISOString(),
      label: "This Year",
    },
    {
      startDate: startOfLastYear.toISOString(),
      endDate: endOfLastYear.toISOString(),
      label: "Last Year",
    },
  ];
};