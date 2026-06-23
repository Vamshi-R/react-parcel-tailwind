import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFound() {
  return (
    <div className="mt-8 space-y-4 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-slate-300">This page could not be found.</p>
      <Link
        to={ROUTES.HOME}
        className="inline-block rounded-lg bg-emerald-500 px-4 py-2 font-medium hover:bg-emerald-400 active:scale-95 transition"
      >
        Back home
      </Link>
    </div>
  );
}
