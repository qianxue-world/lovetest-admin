export interface ActivationCode {
  id: string;
  code: string;
  status: 'active' | 'inactive' | 'used';
  createdAt: string;
  usedAt?: string;
  userId?: string;
}

export interface User {
  username: string;
  role: 'admin';
}
