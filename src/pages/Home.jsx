import React from 'react';
import Counter from '../components/Counter';
import StoreStatus from '../components/StoreStatus';

export default function Home() {
  return (
    <div className="mt-8">
      <Counter />
      <StoreStatus />
    </div>
  );
}
