import React, { useState } from 'react';
import { Place, ViewTab } from '../types';

interface SavedPlacesViewProps {
  places: Place[];
  savedPlaceIds: Set<string>;
  onToggleBookmark: (placeId: string) => void;
  savedTrips: { id: string; name: string; placeIds: string[]; date: string }[];
  onSelectPlaceForDetails: (place: Place) => void;
  onSelectPlaceForMap: (place: Place) => void;
  onStartNavigation: (place: Place) => void;
  onNavigateToTab: (tab: ViewTab) => void;
  onDeleteTrip: (tripId: string) => void;
  onShowToast: (msg: string) => void;
}

export const SavedPlacesView: React.FC<SavedPlacesViewProps> = ({
  places,
  savedPlaceIds,
  onToggleBookmark,
  savedTrips,
  onSelectPlaceForDetails,
  onSelectPlaceForMap,
  onStartNavigation,
  onNavigateToTab,
  onDeleteTrip,
  onShowToast,
}) => {
  const [activeSegment, setActiveSegment] = useState<'places' | 'trips'>('places');

  const bookmarkedPlaces = places.filter((p) => savedPlaceIds.has(p.id));

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] px-4 pb-28 pt-16 gap-4 select-none animate-fade-in max-w-lg mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="text-[22px] font-extrabold text-[#121c2a] tracking-tight">
          บันทึกไว้และทริปของฉัน
        </h1>
        <p className="text-[13px] text-[#414754]">
          รวบรวมหมุดโปรดและเส้นทางสำรวจที่คุณวางแผนไว้
        </p>

        {/* Segmented Switch */}
        <div className="flex items-center p-1 bg-[#dee9fc] rounded-full mt-2">
          <button
            onClick={() => setActiveSegment('places')}
            className={`flex-1 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              activeSegment === 'places'
                ? 'bg-white text-[#005bbf] shadow-sm'
                : 'text-[#414754] hover:text-[#121c2a]'
            }`}
          >
            สถานที่บันทึก ({bookmarkedPlaces.length})
          </button>
          <button
            onClick={() => setActiveSegment('trips')}
            className={`flex-1 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
              activeSegment === 'trips'
                ? 'bg-white text-[#005bbf] shadow-sm'
                : 'text-[#414754] hover:text-[#121c2a]'
            }`}
          >
            ทริปการเดินทาง ({savedTrips.length})
          </button>
        </div>
      </div>

      {/* Segment 1: Bookmarked Places */}
      {activeSegment === 'places' && (
        <div className="flex flex-col gap-3">
          {bookmarkedPlaces.length > 0 ? (
            bookmarkedPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => onSelectPlaceForDetails(place)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs border border-[#e6eeff] hover:border-[#adc7ff] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-[#005bbf] uppercase">
                      {place.badgeLabel || place.categoryLabel.split(' ')[0]}
                    </span>
                    <h3 className="text-[14px] font-bold text-[#121c2a] truncate">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-[#414754] mt-0.5">
                      <span className="text-amber-500 font-bold">⭐ {place.rating}</span>
                      <span>•</span>
                      <span>{place.displayDistance}</span>
                      <span>•</span>
                      <span className="text-[#006e2d] font-semibold">{place.openStatus.split('•')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPlaceForMap(place);
                    }}
                    className="w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#005bbf] flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                    title="ดูบนแผนที่"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(place.id);
                    }}
                    className="w-8 h-8 rounded-full bg-[#ffdad5]/50 hover:bg-[#ffdad5] text-[#b81d17] flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                    title="ลบออกจากรายการ"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_remove</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#e6eeff]">
              <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#005bbf] flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[24px]">bookmark_border</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#121c2a]">ยังไม่มีหมุดที่บันทึกไว้</h3>
              <p className="text-[12px] text-[#727785] mt-1 max-w-xs mx-auto">
                กดไอคอนบุ๊กมาร์กบนการ์ดสถานที่ในหน้าแผนที่หรือรายการเพื่อเข้าถึงได้สะดวกรวดเร็ว
              </p>
              <button
                onClick={() => onNavigateToTab('places-list')}
                className="mt-4 px-4 py-2 rounded-full bg-[#005bbf] text-white text-[12px] font-bold shadow-xs cursor-pointer"
              >
                สำรวจสถานที่แนะนำ
              </button>
            </div>
          )}
        </div>
      )}

      {/* Segment 2: Saved Trips */}
      {activeSegment === 'trips' && (
        <div className="flex flex-col gap-3">
          {savedTrips.length > 0 ? (
            savedTrips.map((trip) => {
              const tripPlaceObjs = trip.placeIds
                .map((id) => places.find((p) => p.id === id))
                .filter((p): p is Place => p !== undefined);

              return (
                <div
                  key={trip.id}
                  className="p-4 rounded-2xl bg-white shadow-xs border border-[#e6eeff] flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#006e2d] bg-[#7cf994]/20 px-2 py-0.5 rounded-full">
                        {trip.date}
                      </span>
                      <h3 className="text-[15px] font-bold text-[#121c2a] mt-1">
                        {trip.name}
                      </h3>
                      <span className="text-[12px] text-[#727785]">
                        รวม {tripPlaceObjs.length} จุดแวะพักในเส้นทาง
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onDeleteTrip(trip.id);
                        onShowToast(`ลบทริป "${trip.name}" แล้ว`);
                      }}
                      className="w-8 h-8 rounded-full bg-[#f8f9ff] text-[#727785] hover:text-[#ba1a1a] flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  {/* Horizontal stops avatars */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {tripPlaceObjs.map((p, idx) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectPlaceForDetails(p)}
                        className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#eff4ff] flex-shrink-0 cursor-pointer hover:bg-[#dee9fc]"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#005bbf] text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-6 h-6 rounded-lg object-cover"
                        />
                        <span className="text-[11px] font-semibold text-[#121c2a] max-w-[100px] truncate">
                          {p.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Start Trip navigation button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (tripPlaceObjs[0]) {
                          onStartNavigation(tripPlaceObjs[0]);
                          onShowToast(`เริ่มนำทางจุดแรกของทริป: ${tripPlaceObjs[0].name}`);
                        }
                      }}
                      className="flex-1 py-2 px-3 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">navigation</span>
                      <span>เริ่มเดินทางตามทริป</span>
                    </button>

                    <button
                      onClick={() => {
                        if (tripPlaceObjs[0]) {
                          onSelectPlaceForMap(tripPlaceObjs[0]);
                        }
                      }}
                      className="py-2 px-3 rounded-full bg-[#eff4ff] hover:bg-[#dee9fc] text-[#005bbf] text-[12px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">map</span>
                      <span>ดูแผนที่</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#e6eeff]">
              <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#005bbf] flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[24px]">add_road</span>
              </div>
              <h3 className="text-[15px] font-bold text-[#121c2a]">ยังไม่มีทริปที่บันทึกไว้</h3>
              <p className="text-[12px] text-[#727785] mt-1 max-w-xs mx-auto">
                ในหน้ารายละเอียดสถานที่ คุณสามารถกดปุ่ม "จัดทริปรอบจุดนี้" เพื่อรวมหลายหมวดหมู่เป็นเส้นทางเที่ยวเดียวได้
              </p>
              <button
                onClick={() => {
                  const watKhaek = places.find((p) => p.id === 'wat-khaek') || places[0];
                  onSelectPlaceForDetails(watKhaek);
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#005bbf] text-white text-[12px] font-bold shadow-xs cursor-pointer"
              >
                ดูตัวอย่างทริปรอบวัดแขก สีลม
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
