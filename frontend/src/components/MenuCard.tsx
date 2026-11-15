import React from 'react';
import type { MenuItem } from '../App';

export default function MenuCard({ item, onSelect }: { item: MenuItem; onSelect: (item: MenuItem) => void }): React.JSX.Element {
  return (
    <div
      onClick={() => onSelect(item)}
      className="border border-slate-200 rounded-xl p-4 hover:border-amber-600 hover:bg-amber-50 transition cursor-pointer flex flex-col justify-between select-none"
    >
      <div className="text-3xl mb-2">{item.icon}</div>
      <div>
        <h3 className="font-semibold text-slate-800">{item.name}</h3>
        <p className="text-amber-700 font-bold text-sm mt-1">{item.price} บาท</p>
      </div>
    </div>
  );
}