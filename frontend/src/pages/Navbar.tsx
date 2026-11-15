import React from 'react';
import BrandLogo from '../components/BrandLogo';
import NavButton from '../components/NavButton';
import RevenueBadge from '../components/RevenueBadge';

type Props = {
  activePage: 'pos' | 'orders' | 'menus';
  onPageChange: (page: 'pos' | 'orders' | 'menus') => void;
  totalRevenue: number;
  pendingCount: number;
};

export default function Navbar({ activePage, onPageChange, totalRevenue, pendingCount }: Props): React.JSX.Element {
  return (
    <nav className="bg-amber-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <BrandLogo onClick={() => onPageChange('pos')} />
          <div className="flex space-x-2">
            <NavButton label="หน้าขายหน้าร้าน (POS)" active={activePage === 'pos'} onClick={() => onPageChange('pos')} />
            <NavButton
              label="ประวัติและคิวออเดอร์"
              active={activePage === 'orders'}
              onClick={() => onPageChange('orders')}
              badge={pendingCount}
            />
            <NavButton label="จัดการเมนูร้าน" active={activePage === 'menus'} onClick={() => onPageChange('menus')} />
          </div>
        </div>
        <RevenueBadge amount={totalRevenue} />
      </div>
    </nav>
  );
}