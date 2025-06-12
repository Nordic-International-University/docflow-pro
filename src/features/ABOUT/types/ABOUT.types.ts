// ABOUT/types/ABOUT.types.ts

export interface ABOUTState {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Qoshimcha fieldlar qoshish
}

export interface ABOUTProps {
  id: string;
  className?: string;
  // Qoshimcha props
}

export interface CreateABOUTRequest {
  name: string;
  description?: string;
  // Yaratish uchun kerakli fieldlar
}

export interface UpdateABOUTRequest {
  name?: string;
  description?: string;
  // Yangilash uchun kerakli fieldlar
}

// API Response types
export interface ABOUTApiResponse {
  data: ABOUTState[];
  total: number;
  page: number;
  limit: number;
}

export interface ABOUTSingleApiResponse {
  data: ABOUTState;
}
