// ABOUT/services/ABOUT.service.ts
import type { ABOUTState, CreateABOUTRequest, UpdateABOUTRequest } from '../types/ABOUT.types';

// API base URL - environment variable dan oling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const ABOUTService = {
  getABOUT: async (): Promise<ABOUTState[]> => {
    const response = await fetch(`${API_BASE_URL}/ABOUT`);
    if (!response.ok) {
      throw new Error('Ma'lumotlarni olishda xatolik');
    }
    return response.json();
  },

  getABOUTById: async (id: string): Promise<ABOUTState> => {
    const response = await fetch(`${API_BASE_URL}/ABOUT/${id}`);
    if (!response.ok) {
      throw new Error('Ma'lumotni olishda xatolik');
    }
    return response.json();
  },

  createABOUT: async (data: CreateABOUTRequest): Promise<ABOUTState> => {
    const response = await fetch(`${API_BASE_URL}/ABOUT`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Yaratishda xatolik');
    }
    return response.json();
  },

  updateABOUT: async (id: string, data: UpdateABOUTRequest): Promise<ABOUTState> => {
    const response = await fetch(`${API_BASE_URL}/ABOUT/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Yangilashda xatolik');
    }
    return response.json();
  },

  deleteABOUT: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/ABOUT/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('O'chirishda xatolik');
    }
  },
};
