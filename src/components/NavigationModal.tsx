import React, { useState } from 'react';
import { Place } from '../types';

interface NavigationModalProps {
  place: Place | null;
  originName: string;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  place,
  originName,
  onClose,
  onShowToast,
}) => {
  const [travelMode, setTravelMode] = useState<'drive' | 'transit' | 'walk'>('drive');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  if (!place) return null;

  const getEta = () => {
    switch (travelMode) {
      case 'drive':
        return { time: Math.max(8, Math.round(place.distanceKm * 3.5)), label: 'นาที (การจราจรปกติ)', icon: 'directions_car' };
      case 'transit':
        return { time: Math.max(12, Math.round(place.distanceKm * 4)), label: 'นาที (BTS/MRT)', icon: 'train' };
      case 'walk':
        return { time: Math.max(15, Math.round(place.distanceKm * 12)), label: 'นาที (ทางราบ)', icon: 'directions_walk' };
    }
  };

  const eta = getEta();

  const handleStartSim = () => {
    setIsSimulating(true);
    setSimStep(1);
    onShowToast(`เริ่มระบบนำทาง GPS ไปยัง "${place.name}"`);
    const timer = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          return 3;
        }
        return prev + 1;
      });
    }, 1800);
  };

  const steps = [
    { title: `มุ่งหน้าไปทางทิศตะวันตกเฉียงใต้ จาก ${originName}`, distance: '250 ม.' },
    { title: 'เลี้ยวซ้ายเข้าสู่ ถนนพระราม ๑ / ถนนอังรีดูนังต์', distance: '1.2 กม.' },
    { title: `เข้าสู่ย่าน ${place.district} มุ่งตรงไปยังจุดหมายปลายทาง`, distance: `${place.displayDistance}` },
    { title: `ถึงจุดหมาย: ${place.name}`, distance: '0 ม.' },
  ];

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.name + ' ' + place.address
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#f8f9ff] rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#e6eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                navigation
              </span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121c2a]">เส้นทางและการนำทาง</h3>
              <p className="text-[12px] text-[#414754]">คำนวณจาก {originName} • รัศมี 20 กม.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f8f9ff] text-[#414754] hover:bg-[#e6eeff] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Origin / Destination Summary */}
        <div className="p-4 bg-white/50 border-b border-[#e6eeff] flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-[13px] text-[#414754]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#005bbf]"></span>
            <span className="font-medium text-[#121c2a]">จุดเริ่มต้น:</span>
            <span>{originName}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#121c2a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc392c]"></span>
            <span className="font-bold text-[#121c2a]">ปลายทาง:</span>
            <span className="font-semibold text-[#005bbf] truncate">{place.name}</span>
          </div>
        </div>

        {/* Travel Mode Pills */}
        <div className="px-4 py-3 bg-[#e6eeff]/60 flex items-center gap-2">
          <button
            onClick={() => setTravelMode('drive')}
            className={`flex-1 py-2 px-2 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              travelMode === 'drive'
                ? 'bg-[#005bbf] text-white shadow-md'
                : 'bg-white text-[#414754] hover:bg-white/80'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            <span>ขับรถ</span>
          </button>
          <button
            onClick={() => setTravelMode('transit')}
            className={`flex-1 py-2 px-2 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              travelMode === 'transit'
                ? 'bg-[#005bbf] text-white shadow-md'
                : 'bg-white text-[#414754] hover:bg-white/80'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">train</span>
            <span>รถไฟฟ้า</span>
          </button>
          <button
            onClick={() => setTravelMode('walk')}
            className={`flex-1 py-2 px-2 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              travelMode === 'walk'
                ? 'bg-[#005bbf] text-white shadow-md'
                : 'bg-white text-[#414754] hover:bg-white/80'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_walk</span>
            <span>เดิน</span>
          </button>
        </div>

        {/* ETA Highlight */}
        <div className="p-4 bg-white flex items-center justify-between border-b border-[#e6eeff]">
          <div className="flex items-center gap-2">
            <span className="text-[28px] font-bold text-[#006e2d]">{eta.time}</span>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#121c2a]">{eta.label}</span>
              <span className="text-[12px] text-[#727785]">ระยะทาง {place.displayDistance}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[12px] px-2.5 py-1 rounded-full bg-[#7cf994]/30 text-[#007230] font-bold">
              {place.openStatus.split('•')[0] || 'เปิดอยู่'}
            </span>
          </div>
        </div>

        {/* Route Steps */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          <span className="text-[12px] font-bold text-[#414754] uppercase tracking-wider block mb-1">
            รายละเอียดเส้นทาง
          </span>
          {steps.map((step, idx) => {
            const isActive = isSimulating && simStep === idx;
            const isPassed = isSimulating && simStep > idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-[#d8e2ff]/50 border-[#005bbf] ring-2 ring-[#005bbf]/20'
                    : isPassed
                    ? 'bg-white/60 border-[#c1c6d6]/60 opacity-60'
                    : 'bg-white border-[#e6eeff]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                    isActive
                      ? 'bg-[#005bbf] text-white animate-pulse'
                      : isPassed
                      ? 'bg-[#006e2d] text-white'
                      : 'bg-[#e6eeff] text-[#414754]'
                  }`}
                >
                  {isPassed ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#121c2a]">{step.title}</p>
                  <span className="text-[11px] text-[#727785]">{step.distance}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-[#e6eeff] flex items-center gap-2.5">
          {!isSimulating ? (
            <button
              onClick={handleStartSim}
              className="flex-1 h-12 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                navigation
              </span>
              <span>เริ่มจำลองการนำทาง</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSimulating(false);
                setSimStep(0);
                onShowToast('หยุดระบบจำลองการนำทาง');
              }}
              className="flex-1 h-12 rounded-full bg-[#27313f] text-white font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">stop_circle</span>
              <span>หยุดจำลอง ({simStep >= 3 ? 'ถึงจุดหมายแล้ว 🎉' : `ขั้นตอนที่ ${simStep + 1}/4`})</span>
            </button>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-4 rounded-full bg-[#e6eeff] hover:bg-[#d8e2ff] text-[#005bbf] font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span className="whitespace-nowrap">Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};
