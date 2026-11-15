import React from 'react';

type Props = {
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
};

export default function NavButton({ label, active, onClick, badge }: Props): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center space-x-2 ${
        active ? 'bg-amber-700 text-white' : 'text-amber-200 hover:bg-amber-800'
      }`}
    >
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );
}