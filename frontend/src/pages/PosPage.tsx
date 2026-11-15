import React, { useState } from 'react';
import type { MenuItem, CartItem, Order } from '../App';
import MenuCard from '../components/MenuCard';
import CartItemRow from '../components/CartItemRow';
import ReceiptModal from '../components/ReceiptModal';
import DrinkOptionModal from '../components/DrinkOptionModal';

type Props = {
  menuItems: MenuItem[];
  onOrderCreated: () => void;
};

const DESSERT_ICONS = ['🥐', '🍰', '🍪'];
const NO_OPTION_ICONS = ['🥐', '🍰', '🍪', '🥤'];
const NO_OPTION_KEYWORDS = ['เอส', 'โค้ก', 'เป๊ปซี่', 'สไปรท์', 'แฟนต้า', 'น้ำอัดลม', 'น้ำเปล่า'];
const ITEMS_PER_PAGE = 9;

export default function PosPage({ menuItems, onOrderCreated }: Props): React.JSX.Element {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'เงินสด' | 'สแกน QR'>('เงินสด');
  const [receivedCash, setReceivedCash] = useState<string>('');
  const [latestReceipt, setLatestReceipt] = useState<Order | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<'ทั้งหมด' | 'เครื่องดื่ม' | 'ขนม'>('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const isDessert = (item: MenuItem) =>
    item.category === 'ขนม' || DESSERT_ICONS.includes(item.icon);

  const hasNoSweetOption = (item: MenuItem) =>
    isDessert(item) ||
    NO_OPTION_ICONS.includes(item.icon) ||
    NO_OPTION_KEYWORDS.some((word) => item.name.includes(word));

  const handleSelectMenu = (item: MenuItem) => {
    if (hasNoSweetOption(item)) {
      setCart((prev) => {
        const existing = prev.find((c) => c.id === item.id);
        if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
        return [...prev, { ...item, qty: 1 }];
      });
    } else {
      setSelectedMenu(item);
    }
  };

  const handleConfirmOption = (item: MenuItem, optionText: string, extraPrice: number) => {
    const customId = `${item.id}-${optionText}`;
    const customName = `${item.name} (${optionText})`;
    const finalPrice = item.price + extraPrice;

    setCart((prev) => {
      const existing = prev.find((c) => c.id === customId);
      if (existing) return prev.map((c) => (c.id === customId ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id: customId, name: customName, price: finalPrice, icon: item.icon, qty: 1 }];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)
    );
  };

  const handleCategoryChange = (cat: 'ทั้งหมด' | 'เครื่องดื่ม' | 'ขนม') => {
    setFilterCategory(cat);
    setCurrentPage(1);
  };

  const filteredMenus = menuItems.filter((item) => {
    if (filterCategory === 'ทั้งหมด') return true;
    const itemCat = isDessert(item) ? 'ขนม' : 'เครื่องดื่ม';
    return itemCat === filterCategory;
  });

  const totalPages = Math.ceil(filteredMenus.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMenus = filteredMenus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cashNumber = Number(receivedCash) || 0;
  const changeAmount = cashNumber - totalPrice;

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return alert('กรุณาเลือกเมนูก่อนสั่งซื้อ');
    if (paymentMethod === 'เงินสด' && cashNumber < totalPrice) {
      return alert('จำนวนเงินที่รับมายังไม่ครบตามยอดรวมครับ');
    }

    const res = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        items: cart,
        totalPrice,
        paymentMethod,
        receivedCash: paymentMethod === 'เงินสด' ? cashNumber : undefined,
        changeAmount: paymentMethod === 'เงินสด' ? changeAmount : undefined,
      }),
    });

    const savedOrder: Order = await res.json();
    setLatestReceipt(savedOrder);
    setCart([]);
    setCustomerName('');
    setReceivedCash('');
    onOrderCreated();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-800">เลือกเมนูเครื่องดื่มและขนม</h2>
              <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
                {(['ทั้งหมด', 'เครื่องดื่ม', 'ขนม'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-amber-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat === 'เครื่องดื่ม' ? '🥤 เครื่องดื่ม' : cat === 'ขนม' ? '🍰 ขนม' : 'ทั้งหมด'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paginatedMenus.map((item) => (
                <MenuCard key={item.id} item={item} onSelect={handleSelectMenu} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-sm">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                ← ก่อนหน้า
              </button>
              <span className="text-slate-500 font-medium">
                หน้า <span className="font-bold text-amber-800">{currentPage}</span> / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                ถัดไป →
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">รายการสั่งซื้อปัจจุบัน</h2>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ชื่อลูกค้า หรือ เลขโต๊ะ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />

            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['เงินสด', 'สแกน QR'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-amber-100 border-amber-600 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {method === 'เงินสด' ? '💵 เงินสด' : '📱 สแกน QR'}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto border-t border-b border-slate-100 py-3">
              {cart.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีรายการในบิล</p>
              ) : (
                cart.map((item) => (
                  <CartItemRow key={item.id} item={item} onUpdateQty={handleUpdateQty} />
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-2 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>ยอดรวมสุทธิ</span>
              <span className="text-amber-700">{totalPrice.toLocaleString()} บาท</span>
            </div>

            {paymentMethod === 'เงินสด' && totalPrice > 0 && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">รับเงินมา:</span>
                  <input
                    type="number"
                    value={receivedCash}
                    onChange={(e) => setReceivedCash(e.target.value)}
                    placeholder="0"
                    className="w-28 px-2 py-1 text-right border border-slate-300 rounded-md bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setReceivedCash(String(totalPrice))}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 py-1 rounded text-xs font-semibold cursor-pointer"
                  >
                    พอดีเป๊ะ
                  </button>
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setReceivedCash(String(amt))}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 py-1 rounded text-xs font-semibold cursor-pointer"
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm font-bold pt-1 border-t border-slate-200">
                  <span className="text-slate-600">เงินทอน:</span>
                  <span className={changeAmount >= 0 ? 'text-green-600' : 'text-red-500'}>
                    {receivedCash === '' ? '0' : changeAmount.toLocaleString()} บาท
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'สแกน QR' && totalPrice > 0 && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-1.5">
                <div className="w-24 h-24 mx-auto bg-white p-1.5 rounded-lg border border-slate-300 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=MiniCafePOS-${totalPrice}THB`}
                    alt="PromptPay QR"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-slate-600 font-medium">สแกน QR เพื่อชำระเงิน {totalPrice.toLocaleString()} บาท</p>
              </div>
            )}

            <button
              onClick={handleSubmitOrder}
              className="w-full bg-amber-700 text-white py-3 rounded-xl font-semibold hover:bg-amber-800 transition cursor-pointer"
            >
              ยืนยันออเดอร์
            </button>
          </div>
        </div>
      </div>

      <DrinkOptionModal
        item={selectedMenu}
        onClose={() => setSelectedMenu(null)}
        onConfirm={handleConfirmOption}
      />

      <ReceiptModal order={latestReceipt} onClose={() => setLatestReceipt(null)} />
    </>
  );
}