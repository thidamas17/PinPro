import React from 'react';

interface ToastProps {
  message: string | null;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = 'check_circle' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#27313f] text-[#eaf1ff] px-4 py-2.5 rounded-full text-[13px] font-semibold shadow-2xl flex items-center gap-2 border border-[#414754]/50 animate-fade-in pointer-events-none transition-all">
      <span className="material-symbols-outlined text-[18px] text-[#7ffc97]">
        {icon}
      </span>
      <span>{message}</span>
    </div>
  );
};
