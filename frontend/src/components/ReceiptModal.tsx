import React from 'react';
import type { Order } from '../App';

export default function ReceiptModal({ order, onClose }: { order: Order | null; onClose: () => void }): React.JSX.Element | null {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        <div className="text-center border-b border-dashed border-slate-300 pb-4">
          <div className="text-3xl mb-1">☕</div>
          <h3 className="text-lg font-bold text-slate-800">ใบเสร็จรับเงิน (Mini Cafe)</h3>
          <p className="text-xs text-slate-500 mt-1">เวลา: {order.createdAt} | ลูกค้า: {order.customerName}</p>
        </div>

        <div className="py-4 space-y-2 border-b border-dashed border-slate-300 text-sm">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.name} x{item.qty}</span>
              <span className="font-medium">{(item.price * item.qty).toLocaleString()} บาท</span>
            </div>
          ))}
        </div>

        <div className="py-4 space-y-1.5 text-sm">
          <div className="flex justify-between font-bold text-base text-slate-800">
            <span>ยอดรวมสุทธิ</span>
            <span>{order.totalPrice.toLocaleString()} บาท</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>วิธีชำระเงิน</span>
            <span>{order.paymentMethod}</span>
          </div>
          {order.paymentMethod === 'เงินสด' && order.receivedCash !== undefined && (
            <>
              <div className="flex justify-between text-slate-500">
                <span>รับเงินมา</span>
                <span>{order.receivedCash.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>เงินทอน</span>
                <span>{(order.changeAmount || 0).toLocaleString()} บาท</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            🖨️ พิมพ์บิล
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
}