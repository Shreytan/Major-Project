export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface IPaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginationResponse<T = any> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    pages: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IValidationError {
  field: string;
  message: string;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  role: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}
