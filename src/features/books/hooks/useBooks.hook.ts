import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksService } from '../services/books.service';
import type { Books, BooksQueryParams } from '../types/books.types';

// Query Keys
export const booksKeys = {
all: ['books'] as const,
lists: () => [...booksKeys.all, 'list'] as const,
list: (params: BooksQueryParams) => [...booksKeys.lists(), params] as const,
details: () => [...booksKeys.all, 'detail'] as const,
detail: (id: string) => [...booksKeys.details(), id] as const,
};

// Get all
export const useBooksList = (params: BooksQueryParams = {}) => {
return useQuery({
queryKey: booksKeys.list(params),
queryFn: () => booksService.getAll(params),
});
};

// Get by ID
export const useBooksById = (id?: string) => {
return useQuery({
queryKey: booksKeys.detail(id!),
queryFn: () => booksService.getById(id!),
enabled: !!id,
});
};

// Create
export const useCreateBooks = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: booksService.create,
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
},
});
};

// Update
export const useUpdateBooks = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: ({ id, data }: { id: string; data: Partial<Books> }) =>
booksService.update(id, data),
onSuccess: (_, { id }) => {
queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
queryClient.invalidateQueries({ queryKey: booksKeys.detail(id) });
},
});
};

// Delete
export const useDeleteBooks = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: booksService.delete,
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
},
});
};