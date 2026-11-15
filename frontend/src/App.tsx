import React, { useState, useEffect } from 'react';
import Navbar from './pages/Navbar';
import PosPage from './pages/PosPage';
import OrdersPage from './pages/OrdersPage';
import MenuManagePage from './pages/MenuManagePage';

export type MenuItem = { id: string; name: string; price: number; icon: string; category?: string };
export type CartItem = MenuItem & { qty: number };
export type Order = {
  id: string;
  customerName: string;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: string;
  receivedCash?: number;
  changeAmount?: number;
  status: string;
  createdAt: string;
};

type PageType = 'pos' | 'orders' | 'menus';

export default function App(): React.JSX.Element {
  const getPageFromUrl = (): PageType => {
    const path = window.location.pathname.replace('/', '');
    if (path === 'orders' || path === 'menus') return path;
    return 'pos';
  };

  const [activePage, setActivePage] = useState<PageType>(getPageFromUrl);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const handlePageChange = (page: PageType) => {
    setActivePage(page);
    window.history.pushState({}, '', `/${page}`);
  };

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/pos');
    }

    const handlePopState = () => setActivePage(getPageFromUrl());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchMenus = async () => {
    const res = await fetch('http://localhost:3000/api/menus');
    setMenuItems(await res.json());
  };

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:3000/api/orders');
    setOrders(await res.json());
  };

  useEffect(() => {
    fetchMenus();
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingCount = orders.filter((order) => order.status === 'รออนุมัติ').length;

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800">
      <Navbar
        activePage={activePage}
        onPageChange={handlePageChange}
        totalRevenue={totalRevenue}
        pendingCount={pendingCount}
      />
      <main className="max-w-7xl mx-auto p-6">
        {activePage === 'pos' && <PosPage menuItems={menuItems} onOrderCreated={fetchOrders} />}
        {activePage === 'orders' && <OrdersPage orders={orders} onRefresh={fetchOrders} />}
        {activePage === 'menus' && <MenuManagePage menuItems={menuItems} onRefreshMenus={fetchMenus} />}
      </main>
    </div>
  );
}