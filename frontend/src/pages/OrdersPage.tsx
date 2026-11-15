import React, { useState } from 'react';
import type { Order } from '../App';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';
import ReceiptModal from '../components/ReceiptModal';

type Props = {
  orders: Order[];
  onRefresh: () => void;
};

export default function OrdersPage({ orders, onRefresh }: Props): React.JSX.Element {
  const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:3000/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    onRefresh();
  };

  const handleDeleteOrder = async (id: string) => {
    await fetch(`http://localhost:3000/api/orders/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'รออนุมัติ').length;
  const approvedCount = orders.filter((o) => o.status === 'อนุมัติแล้ว' || o.status === 'เสิร์ฟแล้ว').length;
  const servedCount = orders.filter((o) => o.status === 'เสิร์ฟแล้ว').length;


  const cashTotal = orders.filter((o) => o.paymentMethod === 'เงินสด').reduce((s, o) => s + o.totalPrice, 0);
  const qrTotal = orders.filter((o) => o.paymentMethod === 'สแกน QR').reduce((s, o) => s + o.totalPrice, 0);


  const itemCounts: Record<string, { name: string; icon: string; qty: number }> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const baseName = item.name.split(' (')[0];
      if (!itemCounts[baseName]) {
        itemCounts[baseName] = { name: baseName, icon: item.icon || '☕', qty: 0 };
      }
      itemCounts[baseName].qty += item.qty;
    });
  });
  const topMenus = Object.values(itemCounts).sort((a, b) => b.qty - a.qty).slice(0, 3);

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard title="ออเดอร์ทั้งหมด" count={totalOrders} colorClass="text-slate-800" />
          <StatCard title="รออนุมัติ" count={pendingCount} colorClass="text-orange-600" />
          <StatCard title="อนุมัติแล้ว" count={approvedCount} colorClass="text-blue-600" />
          <StatCard title="เสิร์ฟสำเร็จแล้ว" count={servedCount} colorClass="text-green-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-3">🏆 เมนูขายดีประจำร้าน (Top 3 Best Sellers)</h3>
            {topMenus.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">ยังไม่มีข้อมูลการขาย</p>
            ) : (
              <div className="space-y-2">
                {topMenus.map((m, idx) => (
                  <div key={m.name} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-amber-700">#{idx + 1}</span>
                      <span>{m.icon}</span>
                      <span className="font-medium text-slate-800">{m.name}</span>
                    </div>
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                      ขายได้ {m.qty} รายการ
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-700 mb-3">💰 สรุปยอดรับแยกตามช่องทางชำระเงิน</h3>
            <div className="grid grid-cols-2 gap-3 my-auto">
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                <p className="text-xs text-green-700 font-medium">💵 รับเงินสด</p>
                <p className="text-xl font-bold text-green-800 mt-1">{cashTotal.toLocaleString()} บาท</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <p className="text-xs text-blue-700 font-medium">📱 สแกน QR</p>
                <p className="text-xl font-bold text-blue-800 mt-1">{qrTotal.toLocaleString()} บาท</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">คิวออเดอร์และประวัติการขายทั้งหมด (MongoDB)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="py-3 px-4">เวลา</th>
                  <th className="py-3 px-4">ลูกค้า / โต๊ะ</th>
                  <th className="py-3 px-4">รายการที่สั่ง</th>
                  <th className="py-3 px-4">ชำระโดย</th>
                  <th className="py-3 px-4">ยอดรวม</th>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400">ยังไม่มีประวัติออเดอร์</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500">{order.createdAt}</td>
                      <td className="py-3 px-4 font-medium">{order.customerName}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {order.items.map((i) => `${i.name} (${i.qty})`).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{order.paymentMethod}</td>
                      <td className="py-3 px-4 font-semibold text-amber-700">{order.totalPrice} บาท</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedReceipt(order)}
                          className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs hover:bg-slate-200 transition cursor-pointer"
                        >
                          ดูบิล
                        </button>

                        {order.status === 'รออนุมัติ' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'อนุมัติแล้ว')}
                            className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs hover:bg-blue-700 transition cursor-pointer"
                          >
                            อนุมัติ
                          </button>
                        )}

                        {order.status === 'อนุมัติแล้ว' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'เสิร์ฟแล้ว')}
                            className="bg-green-600 text-white px-2.5 py-1 rounded-lg text-xs hover:bg-green-700 transition cursor-pointer"
                          >
                            เสิร์ฟแล้ว
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-100 text-red-600 px-2.5 py-1 rounded-lg text-xs hover:bg-red-200 transition cursor-pointer"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </>
  );
}