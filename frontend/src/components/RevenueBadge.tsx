import type React from "react";

export default function RevenueBadge({ amount }: { amount: number }): React.JSX.Element {
    return (
        <div className="bg-amber-900 px-4 py-1.5 rounded-lg text-sm">
            ยอดขายรวม: <span className="font-bold text-amber-300 text-base">{amount.toLocaleString()}</span> บาท
        </div>
    );
}