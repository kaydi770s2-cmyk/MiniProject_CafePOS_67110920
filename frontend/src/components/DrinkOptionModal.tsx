import React, { useState } from 'react';
import type { MenuItem } from '../App';

type Props = {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (item: MenuItem, optionText: string, extraPrice: number) => void;
};

const TYPES = [
  { label: 'เย็น', extra: 0 },
  { label: 'ร้อน', extra: 0 },
  { label: 'ปั่น (+10.-)', extra: 10 },
];

const SWEETS = ['หวานปกติ (100%)', 'หวานน้อย (50%)', 'ไม่หวาน (0%)'];

export default function DrinkOptionModal({ item, onClose, onConfirm }: Props): React.JSX.Element | null {
  const [selectedType, setSelectedType] = useState(TYPES[0]);
  const [selectedSweet, setSelectedSweet] = useState(SWEETS[0]);

  if (!item) return null;

  const handleAdd = () => {
    const optionText = `${selectedType.label.replace(' (+10.-)', '')}, ${selectedSweet}`;
    onConfirm(item, optionText, selectedType.extra);
    setSelectedType(TYPES[0]);
    setSelectedSweet(SWEETS[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <span className="text-3xl">{item.icon}</span>
          <div>
            <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
            <p className="text-sm text-amber-700 font-semibold">ราคาเริ่มต้น {item.price} บาท</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">ประเภทเครื่องดื่ม</p>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  selectedType.label === t.label
                    ? 'bg-amber-100 border-amber-600 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">ระดับความหวาน</p>
          <div className="space-y-2">
            {SWEETS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSweet(s)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border text-left transition cursor-pointer ${
                  selectedSweet === s
                    ? 'bg-amber-100 border-amber-600 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            เพิ่มลงบิล ({item.price + selectedType.extra}.-)
          </button>
        </div>
      </div>
    </div>
  );
}