export type StatsPeriod = "month" | "quarter" | "year";

export interface DashboardStats {
    totalLeads: number;
    conversionRate: number;
    inNegotiation: number;
    newClients: number;
    salesFunnel: FunnelStage[];
    teamRanking: RepresentanteRanking[];
    currentStatusBreakdown: StatusCount[];
    leadsByZone: ZoneCount[];
}

export interface FunnelStage {
    status: string;
    count: number;
}

export interface RepresentanteRanking {
    representanteId: string;
    name: string;
    assignedLeads: number;
    convertedLeads: number;
    conversionRate: number;
}

export interface SupervisorRanking {
    supervisorId: string;
    name: string;
    assignedLeads: number;
    convertedLeads: number;
    conversionRate: number;
}

export interface StatusCount {
    status: string;
    count: number;
}

export interface ZoneCount {
    zone: string;
    count: number;
}