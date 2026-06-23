import React from 'react';
import NavBar from './components/NavBar';
import AppRoutes from './routes/AppRoutes';
import { APP_NAME, APP_TAGLINE } from './constants/app';

export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur p-8 shadow-xl ring-1 ring-white/20">
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="mt-2 text-slate-300">{APP_TAGLINE}</p>
        <NavBar />
        <AppRoutes />
      </div>
    </main>
  );
}
