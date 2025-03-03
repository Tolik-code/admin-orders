import React, { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Spinner from './Spinner';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center text-blue-600">
            <ShoppingCart className="h-6 w-6 mr-2" />
            <span className="font-bold text-xl">Order Manager</span>
          </Link>
        </div>
      </header>
      <main className="py-6 flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      <footer className="bg-white shadow-inner py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Order Management System
        </div>
      </footer>
    </div>
  );
};

export default Layout;