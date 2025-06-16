import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Books } from '../types/books.types';

interface BooksState {
items: Books[];
selectedItem: Books | null;
loading: boolean;
error: string | null;
}

const initialState: BooksState = {
items: [],
selectedItem: null,
loading: false,
error: null,
};

const booksSlice = createSlice({
name: 'books',
initialState,
reducers: {
setItems: (state, action: PayloadAction<Books[]>) => {
state.items = action.payload;
},
setSelectedItem: (state, action: PayloadAction<Books | null>) => {
state.selectedItem = action.payload;
},
setLoading: (state, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
        state.error = action.payload;
        },
        reset: () => initialState,
        },
        });

        export const { setItems, setSelectedItem, setLoading, setError, reset } = booksSlice.actions;
        export default booksSlice.reducer;