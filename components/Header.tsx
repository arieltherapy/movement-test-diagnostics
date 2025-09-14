
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10">
      <h1 className="text-2xl font-bold">אבחון בדיקות תנועה</h1>
      <p className="text-slate-300">סמן את הבדיקות הרלוונטיות, הוסף הערות, והפק דוח מסכם.</p>
    </header>
  );
};

export default Header;
