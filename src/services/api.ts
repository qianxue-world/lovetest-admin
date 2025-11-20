import { API_BASE_URL } from '../config';
import type {
  LoginResponse,
  CodesResponse,
  StatsResponse,
  GenerateCodesRequest,
  GenerateCodesResponse,
  ChangePasswordRequest,
  MessageResponse,
  BatchDeleteRequest,
  BatchDeleteResponse,
} from '../types';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !endpoint.includes('/login')) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword } as ChangePasswordRequest),
    });
  }

  // Code management endpoints
  async getCodes(
    isUsed?: boolean,
    skipToken?: number,
    pageSize: number = 100
  ): Promise<CodesResponse> {
    const params = new URLSearchParams();
    if (isUsed !== undefined) params.append('isUsed', String(isUsed));
    if (skipToken !== undefined) params.append('skipToken', String(skipToken));
    params.append('pageSize', String(pageSize));

    return this.request<CodesResponse>(`/api/admin/codes?${params.toString()}`);
  }

  async generateCodes(request: GenerateCodesRequest): Promise<GenerateCodesResponse> {
    return this.request<GenerateCodesResponse>('/api/admin/generate-codes', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/api/admin/stats');
  }

  async deleteCode(code: string): Promise<MessageResponse> {
    return this.request<MessageResponse>(`/api/admin/codes/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    });
  }

  async deleteExpiredCodes(): Promise<MessageResponse> {
    return this.request<MessageResponse>('/api/admin/codes/expired', {
      method: 'DELETE',
    });
  }

  async batchDeleteCodes(request: BatchDeleteRequest): Promise<BatchDeleteResponse> {
    return this.request<BatchDeleteResponse>('/api/admin/codes/batch-delete', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // 获取所有激活码（用于导出）
  async getAllCodes(): Promise<string[]> {
    const allCodes: string[] = [];
    let skipToken: number | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getCodes(undefined, skipToken, 1000);
      allCodes.push(...response.codes.map(code => code.code));
      
      hasMore = response.hasMore;
      skipToken = response.nextSkipToken || undefined;
    }

    return allCodes;
  }
}

export const apiService = new ApiService();
