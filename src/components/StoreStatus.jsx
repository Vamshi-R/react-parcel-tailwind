import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCount } from '../store/slices/counterSlice';
import { selectThemeMode, toggleTheme } from '../store/slices/themeSlice';
import { formatNumber } from '../utils/number';

/**
 * Demonstrates reading from TWO slices in the store using useSelector
 * (via the useAppSelector wrapper).
 */
export default function StoreStatus() {
  // Selecting from the `counter` slice
  const count = useAppSelector(selectCount);
  // Selecting from the `theme` slice
  const mode = useAppSelector(selectThemeMode);

  const dispatch = useAppDispatch();

  return (
    <div className="mt-6 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Store status
      </h3>

      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-400">counter.count</dt>
          <dd className="font-mono">{formatNumber(count)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">theme.mode</dt>
          <dd className="font-mono">{mode}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => dispatch(toggleTheme())}
        className="mt-4 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium hover:bg-indigo-400 active:scale-95 transition"
      >
        Toggle theme
      </button>
    </div>
  );
}
