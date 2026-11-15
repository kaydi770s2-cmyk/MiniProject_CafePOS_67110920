import React from 'react';

export default function StatusBadge({ status }: { status: string }): React.JSX.Element {
  let colorStyle = 'bg-slate-100 text-slate-700';

  if (status === 'รออนุมัติ') {
    colorStyle = 'bg-orange-100 text-orange-700';
  } else if (status === 'อนุมัติแล้ว') {
    colorStyle = 'bg-blue-100 text-blue-700';
  } else if (status === 'เสิร์ฟแล้ว') {
    colorStyle = 'bg-green-100 text-green-700';
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorStyle}`}>
      {status}
    </span>
  );
}