import React, { useState } from 'react';
import type { MenuItem } from '../App';

type Props = {
  menuItems: MenuItem[];
  onRefreshMenus: () => void;
};

const ICONS = ['🧊', '🥛', '🧋', '🍵', '☕', '🥐', '🍰', '🍪', '🥤'];

export default function MenuManagePage({ menuItems, onRefreshMenus }: Props): React.JSX.Element {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [icon, setIcon] = useState('☕');
  const [category, setCategory] = useState<'เครื่องดื่ม' | 'ขนม'>('เครื่องดื่ม');

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return alert('กรุณากรอกชื่อเมนูและราคาให้ครบครับ');

    await fetch('http://localhost:3000/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), price: Number(price), icon, category }),
    });

    setName('');
    setPrice('');
    onRefreshMenus();
  };

  const handleDeleteMenu = async (id: string) => {
    await fetch(`http://localhost:3000/api/menus/${id}`, { method: 'DELETE' });
    onRefreshMenus();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <form onSubmit={handleAddMenu} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 h-fit">
        <h2 className="text-lg font-bold text-slate-800">เพิ่มเมนูใหม่เข้าร้าน</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
          <div className="grid grid-cols-2 gap-2">
            {(['เครื่องดื่ม', 'ขนม'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  category === cat
                    ? 'bg-amber-100 border-amber-600 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {cat === 'เครื่องดื่ม' ? '🥤 เครื่องดื่ม' : '🍰 ขนม'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อเมนู</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น คาปูชิโน่เย็น"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ราคา (บาท)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="60"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">เลือกไอคอน</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center cursor-pointer ${
                  icon === ic ? 'border-amber-600 bg-amber-100' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-amber-700 text-white py-2.5 rounded-xl font-semibold hover:bg-amber-800 transition cursor-pointer">
          + บันทึกเมนูลง MongoDB
        </button>
      </form>

      <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">รายการเมนูทั้งหมดในฐานข้อมูล ({menuItems.length} รายการ)</h2>
        <div className="divide-y divide-slate-100">
          {menuItems.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.category || 'เครื่องดื่ม'}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 font-medium">{item.price} บาท</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteMenu(item.id)}
                className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition cursor-pointer"
              >
                ลบเมนู
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}