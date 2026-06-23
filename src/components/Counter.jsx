import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { increment, decrement, reset, selectCount } from '../store/slices/counterSlice';
import { formatNumber } from '../utils/number';

export default function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-5xl font-mono tabular-nums">
        {formatNumber(count)}
      </span>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => dispatch(decrement())}
          className="rounded-lg bg-rose-500 px-4 py-2 font-medium hover:bg-rose-400 active:scale-95 transition"
        >
          - Decrement
        </button>
        <button
          type="button"
          onClick={() => dispatch(reset())}
          className="rounded-lg bg-slate-500 px-4 py-2 font-medium hover:bg-slate-400 active:scale-95 transition"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => dispatch(increment())}
          className="rounded-lg bg-emerald-500 px-4 py-2 font-medium hover:bg-emerald-400 active:scale-95 transition"
        >
          + Increment
        </button>
      </div>
    </div>
  );
}
