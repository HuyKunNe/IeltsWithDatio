export interface ApiResponse {
  message: string;
  status: string;
  data?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  message: string;
  status: string;
  errors?: Record<string, string[]>;
}
