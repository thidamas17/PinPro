import React from 'react';
import { Place } from '../types';

interface TripPlanModalProps {
  anchorPlace: Place | null;
  nearbyPlaces: Place[];
  onClose: () => void;
  onSaveTrip: (tripName: string, placeIds: string[]) => void;
  onNavigatePlace: (place: Place) => void;
  onShowToast: (msg: string) => void;
}

export const TripPlanModal: React.FC<TripPlanModalProps> = ({
  anchorPlace,
  nearbyPlaces,
  onClose,
  onSaveTrip,
  onNavigatePlace,
  onShowToast,
}) => {
  if (!anchorPlace) return null;

  const allTripStops = [anchorPlace, ...nearbyPlaces];
  const totalStops = allTripStops.length;
  const estimatedHours = (totalStops * 0.75).toFixed(1);

  const handleSave = () => {
    onSaveTrip(`ทริปรอบ ${anchorPlace.name}`, allTripStops.map((p) => p.id));
    onShowToast(`บันทึกทริป "${anchorPlace.name} (${totalStops} จุด)" ลงในแท็บบันทึกไว้แล้ว 🗺️`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#f8f9ff] rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#e6eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#005bbf] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">add_road</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121c2a]">จัดทริปรอบจุดนี้</h3>
              <p className="text-[11px] text-[#414754]">
                จุดหลัก: {anchorPlace.name} + {nearbyPlaces.length} จุดใกล้เคียง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f8f9ff] text-[#414754] hover:bg-[#e6eeff] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Trip Summary Card */}
        <div className="p-4 bg-[#eff4ff] border-b border-[#e6eeff] flex items-center justify-between">
          <div>
            <span className="text-[12px] font-semibold text-[#005bbf] block">แผนเส้นทางแนะนำอัตโนมัติ</span>
            <span className="text-[14px] font-bold text-[#121c2a]">
              ระยะเวลาประมาณ ~{estimatedHours} ชม.
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[12px] font-bold text-[#006e2d] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#006e2d] animate-pulse"></span>
            <span>{totalStops} จุดแวะพัก</span>
          </div>
        </div>

        {/* Itinerary List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {allTripStops.map((place, idx) => {
            const isAnchor = idx === 0;

            return (
              <div
                key={place.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isAnchor
                    ? 'bg-white border-[#005bbf] ring-2 ring-[#005bbf]/15 shadow-sm'
                    : 'bg-white border-[#e6eeff]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                      isAnchor
                        ? 'bg-[#dc392c] text-white shadow-sm'
                        : 'bg-[#e6eeff] text-[#005bbf]'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
                  />

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f8f9ff] border border-[#e6eeff] text-[#414754] truncate">
                        {place.badgeLabel || place.categoryLabel.split(' ')[0]}
                      </span>
                      {isAnchor && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#dc392c]/10 text-[#dc392c]">
                          จุดหลัก
                        </span>
                      )}
                    </div>
                    <h4 className="text-[13px] font-bold text-[#121c2a] truncate mt-0.5">
                      {place.name}
                    </h4>
                    <span className="text-[11px] text-[#727785] truncate">
                      ⭐ {place.rating} • {place.displayDistance}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigatePlace(place)}
                  className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#005bbf] flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 cursor-pointer"
                  title="นำทางเฉพาะจุดนี้"
                >
                  <span className="material-symbols-outlined text-[16px]">turn_right</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-white border-t border-[#e6eeff] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#121c2a] font-bold text-[13px] active:scale-95 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-12 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
            <span>บันทึกทริปนี้</span>
          </button>
        </div>
      </div>
    </div>
  );
};
