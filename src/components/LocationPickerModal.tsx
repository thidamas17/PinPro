import React from 'react';
import { LOCATION_HUBS } from '../data/placesData';
import { LocationHub } from '../types';

interface LocationPickerModalProps {
  currentHub: LocationHub;
  onSelectHub: (hub: LocationHub) => void;
  onClose: () => void;
  radiusKm: number;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  currentHub,
  onSelectHub,
  onClose,
  radiusKm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-[#e6eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#005bbf]">
              <span className="material-symbols-outlined text-[18px]">my_location</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121c2a]">เลือกตำแหน่งศูนย์กลาง</h3>
              <p className="text-[11px] text-[#414754]">คำนวณระยะทางและหมุดในรัศมี {radiusKm} กม.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f8f9ff] text-[#414754] hover:bg-[#e6eeff] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-2.5 overflow-y-auto no-scrollbar">
          {LOCATION_HUBS.map((hub) => {
            const isSelected = hub.id === currentHub.id;
            return (
              <button
                key={hub.id}
                onClick={() => {
                  onSelectHub(hub);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#eff4ff] border-[#005bbf] ring-2 ring-[#005bbf]/20 shadow-sm'
                    : 'bg-white border-[#e6eeff] hover:bg-[#f8f9ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isSelected ? 'text-[#005bbf]' : 'text-[#727785]'
                    }`}
                    style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    location_on
                  </span>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#121c2a]">{hub.name}</h4>
                    <span className="text-[12px] text-[#727785]">{hub.province}</span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#005bbf] text-white text-[11px] font-bold">
                    เลือกอยู่
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px] text-[#c1c6d6]">
                    chevron_right
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-[#f8f9ff] border-t border-[#e6eeff] text-center">
          <p className="text-[12px] text-[#727785]">
            ระบบจะอัปเดตระยะทางของทุกหมุดและเส้นทางรอบพิกัดที่เลือกโดยอัตโนมัติ
          </p>
        </div>
      </div>
    </div>
  );
};
