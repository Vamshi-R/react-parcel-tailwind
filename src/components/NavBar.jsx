import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants/routes';

export default function NavBar() {
  return (
    <nav className="mt-6 flex gap-2">
      {NAV_LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? 'bg-white/20 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
