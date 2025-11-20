export interface ActivationCode {
  id: number;
  code: string;
  isUsed: boolean;
  activatedAt: string | null;
  expiresAt: string | null;
}

export interface User {
  username: string;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string | null;
}

export interface CodesResponse {
  codes: ActivationCode[];
  totalCount: number;
  pageSize: number;
  nextSkipToken: number | null;
  hasMore: boolean;
}

export interface StatsResponse {
  totalCodes: number;
  unusedCodes: number;
  usedCodes: number;
  activeCodes: number;
}

export interface GenerateCodesRequest {
  count: number;
  prefix?: string;
}

export interface GenerateCodesResponse {
  message: string;
  count: number;
  prefix: string;
  codes?: string[];
  note?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export interface BatchDeleteRequest {
  pattern: string;
  dryRun?: boolean;
}

export interface BatchDeleteResponse {
  success: boolean;
  message: string;
  matchedCount: number;
  deletedCount: number;
  matchedCodes: string[];
  wasDryRun: boolean;
}
