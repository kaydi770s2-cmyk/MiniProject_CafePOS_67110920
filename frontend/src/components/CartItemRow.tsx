import React from 'react';
import type { CartItem } from '../App';

type Props = {
  item: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
};

export default function CartItemRow({ item, onUpdateQty }: Props): React.JSX.Element {
  return (
    <div className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
      <div>
        <div className="font-medium text-slate-800">{item.name}</div>
        <div className="text-slate-500 text-xs">{item.price} บาท / ชิ้น</div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQty(item.id, -1)}
          className="w-6 h-6 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
        >
          -
        </button>
        <span className="w-5 text-center font-semibold">{item.qty}</span>
        <button
          onClick={() => onUpdateQty(item.id, 1)}
          className="w-6 h-6 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold flex items-center justify-center cursor-pointer"
        >
          +
        </button>
        <span className="font-semibold w-14 text-right text-amber-800">{item.price * item.qty}.-</span>
      </div>
    </div>
  );
}