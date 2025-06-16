import { api } from '../../../lib/axios';
import type { Books, BooksQueryParams, BooksResponse } from '../types/books.types';

class BooksService {
private readonly baseUrl = '/api/books';

async getAll(params: BooksQueryParams = {}): Promise<BooksResponse> {
    const { data } = await api.get<BooksResponse>(this.baseUrl, { params });
        return data;
        }

        async getById(id: string): Promise<Books> {
        const { data } = await api.get<Books>(`${this.baseUrl}/${id}`);
        return data;
        }

        async create(payload: Partial<Books>): Promise<Books> {
        const { data } = await api.post<Books>(this.baseUrl, payload);
        return data;
        }

        async update(id: string, payload: Partial<Books>): Promise<Books> {
        const { data } = await api.put<Books>(`${this.baseUrl}/${id}`, payload);
        return data;
        }

        async delete(id: string): Promise<void> {
            await api.delete(`${this.baseUrl}/${id}`);
            }
            }

            export const booksService = new BooksService();