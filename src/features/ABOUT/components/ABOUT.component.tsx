// ABOUT/components/ABOUT.component.tsx
import React from 'react';
import type { ABOUTProps } from '../types/ABOUT.types';

export default function ABOUTComponent(props: ABOUTProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the ABOUT Feature!</h1>
      <p>Props ID: {props.id}</p>
      {/* ABOUT component content */}
    </div>
  );
}
