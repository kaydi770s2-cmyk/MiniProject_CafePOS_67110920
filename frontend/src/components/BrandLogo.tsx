import React from 'react';

export default function BrandLogo({ onClick }: { onClick?: () => void }): React.JSX.Element {
  return (
    <div onClick={onClick} className="flex items-center space-x-3 cursor-pointer select-none">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMtRHG-vzGOhal7ORZzE2HAI1rjCUbxd4hSnyF5YZX_GZ55bP8ABLGPDYv&s=10"
        alt="Cafe Logo"
        className="w-9 h-9 rounded-full object-cover bg-white p-0.5 shadow-sm"
      />
      <h1 className="text-xl font-bold tracking-wide">Mini Cafe POS</h1>
    </div>
  );
}