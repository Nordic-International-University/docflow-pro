// ABOUT/store/ABOUT.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ABOUTState } from '../types/ABOUT.types';
import { ABOUTService } from '../services/ABOUT.service';

interface ABOUTStoreState {
  items: ABOUTState[];
  currentItem: ABOUTState | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ABOUTStoreState = {
  items: [],
  currentItem: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchABOUT = createAsyncThunk(
  'ABOUT/fetchABOUT',
  async () => {
    const response = await ABOUTService.getABOUT();
    return response;
  }
);

export const fetchABOUTById = createAsyncThunk(
  'ABOUT/fetchABOUTById',
  async (id: string) => {
    const response = await ABOUTService.getABOUTById(id);
    return response;
  }
);

export const createABOUT = createAsyncThunk(
  'ABOUT/createABOUT',
  async (data: any) => {
    const response = await ABOUTService.createABOUT(data);
    return response;
  }
);

export const updateABOUT = createAsyncThunk(
  'ABOUT/updateABOUT',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await ABOUTService.updateABOUT(id, data);
    return response;
  }
);

export const deleteABOUT = createAsyncThunk(
  'ABOUT/deleteABOUT',
  async (id: string) => {
    await ABOUTService.deleteABOUT(id);
    return id;
  }
);

const ABOUTSlice = createSlice({
  name: 'ABOUT',
  initialState,
  reducers: {
    clearABOUTError: (state) => {
      state.error = null;
    },
    setCurrentItem: (state, action: PayloadAction<ABOUTState | null>) => {
      state.currentItem = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ABOUT
      .addCase(fetchABOUT.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchABOUT.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchABOUT.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Xatolik yuz berdi';
      })
      // Fetch ABOUT by ID
      .addCase(fetchABOUTById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      // Create ABOUT
      .addCase(createABOUT.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update ABOUT
      .addCase(updateABOUT.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?.id === action.payload.id) {
          state.currentItem = action.payload;
        }
      })
      // Delete ABOUT
      .addCase(deleteABOUT.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      });
  },
});

export const { clearABOUTError, setCurrentItem } = ABOUTSlice.actions;
export default ABOUTSlice.reducer;
