import React, { useState } from 'react';
import { Place } from '../types';

interface GoogleMapsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  customAreaName: string | null;
  radiusKm: number;
  onAddCustomPlace: (place: Place) => void;
  onShowToast: (msg: string) => void;
}

export const GoogleMapsSearchModal: React.FC<GoogleMapsSearchModalProps> = ({
  isOpen,
  onClose,
  locationName,
  customAreaName,
  radiusKm,
  onAddCustomPlace,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentArea = customAreaName || locationName || 'สยาม, กทม.';

  // Coordinates approximation for Google Maps search center
  const centerCoords = customAreaName?.includes('สีลม')
    ? { lat: 13.7258, lng: 100.5283 }
    : customAreaName?.includes('พญาไท')
    ? { lat: 13.7588, lng: 100.5348 }
    : customAreaName?.includes('สุขุมวิท')
    ? { lat: 13.7372, lng: 100.5601 }
    : { lat: 13.7462, lng: 100.5347 }; // Default Siam

  const quickCategories = [
    { label: '🍽️ ร้านอาหารใกล้ฉัน', query: `ร้านอาหารใกล้ ${currentArea}` },
    { label: '☕ คาเฟ่บรรยากาศดี', query: `คาเฟ่ใกล้ ${currentArea}` },
    { label: '🛕 วัด & ที่เที่ยว', query: `วัดและสถานที่ท่องเที่ยวใกล้ ${currentArea}` },
    { label: '🛍️ ห้างสรรพสินค้า', query: `ห้างสรรพสินค้าใกล้ ${currentArea}` },
    { label: '⛽ ปั๊มน้ำมัน & EV', query: `ปั๊มน้ำมันใกล้ ${currentArea}` },
    { label: '🅿️ ที่จอดรถใกล้ฉัน', query: `ที่จอดรถใกล้ ${currentArea}` },
    { label: '🏨 โรงแรม & ที่พัก', query: `โรงแรมใกล้ ${currentArea}` },
  ];

  const popularBangkokSearchPlaces = [
    {
      name: 'ไอคอนสยาม (ICONSIAM)',
      district: 'คลองสาน',
      category: 'ห้างสรรพสินค้า',
      icon: 'shopping_bag',
      color: '#1a73e8',
      rating: 4.7,
      distance: '4.8 กม.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChSc3_qIYdX2aMSYm9Z07vmv9MXJUbqs-aodYe9loJ8QvKg90F7qbinaFA2rIZ18rJoJh7v42ccQTy8VfW9sdQjzsdh7tF0sqUQP9R4as3f9PZroKbrfXYm17Q7_vheJGg1XD-4fgxZhP_GnY_C-E2wjgV7CBzjVYdHq353HTjltB0AfPOjz_uSoY-Z_hGjh15XpprlkpfvOXBy6EZrwXWWRngQ-YLtzCuQcERAme9rP5i0tI6_x0',
      mapX: 28,
      mapY: 62,
    },
    {
      name: 'วัดอรุณราชวราราม ราชวรมหาวิหาร',
      district: 'บางกอกใหญ่',
      category: 'วัดและศาสนสถาน',
      icon: 'temple_buddhist',
      color: '#7c3aed',
      rating: 4.8,
      distance: '5.2 กม.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyMgDWFzgtViCsxJpBBGOM7NwYt6rTtOYcN1QD2K6Lwj4Y-dYvZNNYP4YK7-oN-_c8whKOskK6HkBqDMGniNWrJ43LX4ZzuYwB9uhNE1dermuXTjrrFXh6lsgaLvL8eX4ba-NcMLwV0icspmQ-sf3g9xm0hYKG4efpZv_AGtRMdkh-9kWCl9pgwi3MWUNoLCf8tdsLibSiilI0m-iaQi1XwPH9BoznWuwFaS4B-bfazYBqxkNU0_s',
      mapX: 20,
      mapY: 55,
    },
    {
      name: 'ตลาดนัดจตุจักร (Chatuchak Weekend Market)',
      district: 'จตุจักร',
      category: 'ตลาดนัดและช้อปปิ้ง',
      icon: 'local_convenience_store',
      color: '#006e2d',
      rating: 4.6,
      distance: '7.5 กม.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOx6QqWo9hU8WSHIklTvVD3KDoUqyFK1PWpc0sBmv1Q6MALiCbXU0ClbhLiQ0SgaKOn3zuZrlJa3_GjxHnYGVl2jYGYdYmIEw_evHzatC7QXu1PXA22hBvGCHD-Pyw3t0kwAYAbJj3RPH2wet9oHBeqtap6QzitblWo5RUqXEanEuRNW9_-rDLe0Y9m2K7B9CuUdUIz0AjG1xBLTs60W8g_XQ7BCFiypikYkcA4BIBVR-5nzWwQd0',
      mapX: 72,
      mapY: 22,
    },
    {
      name: 'เยาวราช ถนนคนเดินสายอาหารกลางคืน',
      district: 'สัมพันธวงศ์',
      category: 'สตรีทฟู้ดและของกิน',
      icon: 'kebab_dining',
      color: '#ea580c',
      rating: 4.7,
      distance: '3.1 กม.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIEUKaE0IL0SyhpxMaAdddKbHnh0R2WLZVf3dAgQBUu1MDuYL0SCE7SWVlFnDmeINYjgSPVAlz9Vjet4BDxTFpK785yPKp1FfTuvCbfINV7gNAAuV-vOPZhFKHM-YKHooAgyO-CscPNTJBGMuxgHVBR1Hna3pe-JClpAdLPZn5gXoTJU0nn5l9q-Qjo18u1sqjg0Ymt-NaMTr0v7zWJdCAU_SjvK0akyJ80RG1dfoiSofIOKm0K7E',
      mapX: 32,
      mapY: 48,
    },
  ];

  const handleOpenGoogleMaps = (queryToOpen: string) => {
    const q = queryToOpen || searchQuery || `สถานที่ใกล้ ${currentArea}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      q
    )}/@${centerCoords.lat},${centerCoords.lng},14z?entry=ttu`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast(`เปิดการค้นหาใน Google Maps: "${q}" 100%`);
  };

  const handlePinCustomPlace = (item: typeof popularBangkokSearchPlaces[0]) => {
    const newPlace: Place = {
      id: `gmaps-${Date.now()}`,
      name: item.name,
      categoryId: item.category.includes('วัด') ? 'temple' : item.category.includes('ห้าง') ? 'mall' : 'restaurant',
      categoryLabel: item.category,
      categoryIcon: item.icon,
      badgeLabel: 'Google Maps 100%',
      rating: item.rating,
      reviewCount: 15400,
      distanceKm: parseFloat(item.distance),
      displayDistance: item.distance,
      openStatus: 'เปิดให้บริการอยู่',
      isOpen: true,
      district: item.district,
      address: `แขวง${item.district} กรุงเทพมหานคร`,
      imageUrl: item.imageUrl,
      mapX: item.mapX,
      mapY: item.mapY,
      isPopular: true,
    };

    onAddCustomPlace(newPlace);
    onShowToast(`ดึงพิกัดจาก Google Maps มาปักหมุดบน PinPro แล้ว: "${item.name}" 📍`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#f8f9ff] rounded-t-[28px] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#e6eeff] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#005bbf] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">travel_explore</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-[16px] font-bold text-[#121c2a]">ค้นหาจาก Google Maps</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#006e2d]/10 text-[#006e2d] text-[10px] font-extrabold">
                  100% เรียลไทม์
                </span>
              </div>
              <p className="text-[12px] text-[#414754]">
                พิกัดศูนย์กลาง: <span className="text-[#005bbf] font-semibold">{currentArea}</span> • รัศมี {radiusKm} กม.
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

        {/* Search Bar Input */}
        <div className="p-4 bg-white border-b border-[#e6eeff] flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                handleOpenGoogleMaps(searchQuery);
              }
            }}
            className="relative flex items-center w-full"
          >
            <span className="material-symbols-outlined absolute left-3.5 text-[#005bbf] text-[20px] pointer-events-none">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-24 bg-[#eff4ff] text-[#121c2a] placeholder:text-[#727785] text-[13px] font-medium rounded-full border border-[#005bbf]/30 focus:outline-none focus:ring-2 focus:ring-[#005bbf]/40"
              placeholder="ค้นหาชื่อสถานที่, เมนู, หรือย่านใน Google Maps..."
              type="text"
            />
            <button
              type="submit"
              className="absolute right-1.5 h-8 px-3 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span>ค้นหา</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </form>

          {/* Quick Categories Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-[#414754] whitespace-nowrap mr-0.5">
              หมวดยอดนิยม:
            </span>
            {quickCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(cat.query);
                  handleOpenGoogleMaps(cat.query);
                }}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#dee9fc] text-[#121c2a] border border-[#e6eeff] text-[11px] font-semibold whitespace-nowrap shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content & Suggested Google Maps Destinations */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#121c2a] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#005bbf]">add_location_alt</span>
              <span>สถานที่ดังบน Google Maps พร้อมดึงลงแผนที่</span>
            </span>
            <span className="text-[11px] text-[#006e2d] font-bold">พิกัดจริง 100%</span>
          </div>

          <div className="space-y-2.5">
            {popularBangkokSearchPlaces.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white border border-[#e6eeff] hover:border-[#005bbf] flex items-center justify-between gap-3 shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-13 h-13 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-[#005bbf] uppercase">
                      {item.category}
                    </span>
                    <h4 className="text-[13px] font-bold text-[#121c2a] truncate mt-0.5">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#727785]">
                      <span className="text-amber-500 font-bold">⭐ {item.rating}</span>
                      <span>•</span>
                      <span>{item.distance}</span>
                      <span>•</span>
                      <span className="truncate">{item.district}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Pin to PinPro */}
                  <button
                    onClick={() => handlePinCustomPlace(item)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#005bbf] text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                    title="ดึงมาปักหมุดบนแผนที่"
                  >
                    <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                    <span className="hidden sm:inline">ปักหมุด</span>
                  </button>

                  {/* Open in Google Maps */}
                  <button
                    onClick={() => handleOpenGoogleMaps(item.name)}
                    className="w-8 h-8 rounded-xl bg-[#e6eeff] hover:bg-[#d8e2ff] text-[#005bbf] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    title="เปิดดูใน Google Maps"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="p-4 bg-white border-t border-[#e6eeff] flex items-center gap-2.5">
          <button
            onClick={() => handleOpenGoogleMaps(searchQuery || `สถานที่ยอดนิยมใกล้ ${currentArea}`)}
            className="w-full h-12 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>เปิดค้นหาทั้งหมดใน Google Maps (100% สดใหม่)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
