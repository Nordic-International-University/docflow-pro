import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { ErrorBoundary } from '../error/error.baundary';
import { Book } from 'lucide-react';

const BooksPage = lazy(() => import('../components/books.component'));

export const booksRoute: RouteObject = {
path: '/books',
element: (
<>
<ErrorBoundary>
    <BooksPage />
</ErrorBoundary>
</>
),
handle: {
title: 'Books',
breadcrumb: 'Books',
icon: Book, // <-- icon as React component
auth: true,
permissions: ['view_books'],
layout: true,
},
errorElement: (
<ErrorBoundary>
    <BooksPage />
</ErrorBoundary>
),
loader: async () => {
return null;
},
};
