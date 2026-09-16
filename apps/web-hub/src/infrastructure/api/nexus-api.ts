import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const nexusClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token automatically from localStorage
nexusClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vkc_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  kula: string;
  trade: string;
  district: string;
  mandal?: string;
  state?: string;
  mpin: string;
  source?: 'ORGANIC' | 'EKTHA_YATRA' | 'WEB' | 'REFERRAL';
  campaignTag?: string;
  latitude?: number;
  longitude?: number;
}

export interface RegisterResponse {
  user: {
    publicId: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  profile: {
    digitalId: string;
    phone: string;
    kula: string;
    trade: string;
    district: string;
    mandal?: string;
    state: string;
    assemblyConstituency?: string;
    parliamentaryConstituency?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IdCardResponse {
  svg: string;
  digitalId: string;
  verifyUrl: string;
  whatsappShareLink: string;
}

export interface VerificationData {
  isAuthentic: boolean;
  digitalId: string;
  name: string;
  kula: string;
  trade: string;
  district: string;
  state: string;
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  status: string;
  membershipYear: number;
  verificationTimestamp: string;
  message: string;
}

export const NexusApi = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await nexusClient.post('/auth/register', payload);
    const data = res.data?.data || res.data;
    if (data?.tokens?.accessToken) {
      localStorage.setItem('vkc_token', data.tokens.accessToken);
      if (data.tokens.refreshToken) {
        localStorage.setItem('vkc_refresh_token', data.tokens.refreshToken);
      }
    }
    return data;
  },

  async getIdCard(): Promise<IdCardResponse> {
    const res = await nexusClient.get('/members/me/id-card');
    return res.data?.data || res.data;
  },

  getDownloadCardUrl(): string {
    return `${API_BASE_URL}/members/me/id-card/download`;
  },

  async updateLocation(coords: { latitude: number; longitude: number }): Promise<any> {
    const res = await nexusClient.patch('/members/me/location', coords);
    return res.data?.data || res.data;
  },

  async verifyDigitalId(digitalId: string): Promise<VerificationData> {
    const res = await nexusClient.get(`/members/verify/${encodeURIComponent(digitalId)}`);
    return res.data?.data || res.data;
  },
};
