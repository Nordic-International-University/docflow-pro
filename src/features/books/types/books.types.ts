export interface Books {
id: string;
name: string;
createdAt: string;
updatedAt: string;
}

export interface BooksQueryParams {
page?: number;
limit?: number;
search?: string;
sortBy?: string;
sortOrder?: 'asc' | 'desc';
}

export interface BooksResponse {
data: Books[];
total: number;
page: number;
totalPages: number;
}