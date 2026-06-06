export interface ApiSuccess<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    error: string;
    details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PlatformStats {
    totalEntries: number;
    totalCompanies: number;
    totalRoles: number;
    totalLocations: number;
    medianTcByRole: { role: string; medianTc: number; count: number }[];
    topCompaniesByTc: { company: string; slug: string; medianTc: number }[];
}