import React, { useState } from 'react';
import { Place } from '../types';

interface PlaceDetailsViewProps {
  place: Place;
  allPlaces: Place[];
  onBack: () => void;
  savedPlaceIds: Set<string>;
  onToggleBookmark: (placeId: string) => void;
  tripPlaceIds: Set<string>;
  onToggleTripItem: (placeId: string) => void;
  onStartNavigation: (place: Place) => void;
  onOpenTripModal: () => void;
  onShowToast: (msg: string) => void;
  onSelectNearbyPlace: (place: Place) => void;
}

export const PlaceDetailsView: React.FC<PlaceDetailsViewProps> = ({
  place,
  allPlaces,
  onBack,
  savedPlaceIds,
  onToggleBookmark,
  tripPlaceIds,
  onToggleTripItem,
  onStartNavigation,
  onOpenTripModal,
  onShowToast,
  onSelectNearbyPlace,
}) => {
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  const isBookmarked = savedPlaceIds.has(place.id);
  const isInTrip = tripPlaceIds.has(place.id);

  // Look up nearby places
  const nearbyIds = place.nearbyPlaces || ['luka-cafe', 'prachak-duck', 'silom-complex', 'mirzaheed-mosque'];
  const nearbyPlaceObjects = nearbyIds
    .map((id) => allPlaces.find((p) => p.id === id))
    .filter((p): p is Place => p !== undefined);

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast(`คัดลอกลิงก์และพิกัด "${place.name}" แล้ว 🔗`);
  };

  const handleHighlight = (cardId: string, itemPlace?: Place) => {
    setHighlightedCardId(cardId);
    const element = document.getElementById(cardId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedCardId(null);
    }, 1500);

    if (itemPlace) {
      onShowToast(`เลือก "${itemPlace.name}" (${itemPlace.displayDistance})`);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] pb-24 pt-16 animate-fade-in select-none">
      {/* Place Hero Showcase */}
      <div className="relative w-full overflow-hidden bg-[#dee9fc]">
        <div
          className="relative w-full h-72 bg-cover bg-center flex flex-col justify-between p-4"
          style={{ backgroundImage: `url('${place.imageUrl}')` }}
        >
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a]/90 via-[#121c2a]/40 to-transparent"></div>

          {/* Top Floating Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#006e2d] animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#121c2a]">
                อยู่ในรัศมีค้นหา 20 กม.
              </span>
            </div>

            <button
              aria-label="บันทึกสถานที่"
              onClick={() => onToggleBookmark(place.id)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#121c2a] active:scale-90 transition-transform shadow-sm cursor-pointer hover:bg-white"
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isBookmarked ? 'text-[#b81d17]' : 'text-[#414754]'
                }`}
                style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
          </div>

          {/* Hero Bottom Content */}
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#1a73e8] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                <span>🛕</span>
                <span>{place.categoryLabel}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#414754] text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-[14px] text-[#005bbf]">
                  near_me
                </span>
                <span>ห่างจากคุณ {place.displayDistance}</span>
              </span>
            </div>

            <h2 className="text-[20px] sm:text-[22px] text-white font-bold drop-shadow-md leading-tight">
              {place.name}
            </h2>
          </div>
        </div>

        {/* Rating & Status Strip */}
        <div className="px-4 py-2.5 bg-[#eff4ff] flex items-center justify-between border-b border-[#e6eeff]">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-[16px] font-bold text-[#121c2a] ml-1">
                {place.rating}
              </span>
            </div>
            <span className="text-[12px] text-[#414754]">
              ({place.reviewCount.toLocaleString()} รีวิวใน Google Maps)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7cf994]/30 text-[#007230]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006e2d]"></span>
            <span className="text-[11px] font-bold">
              {place.openStatus || 'เปิดอยู่'}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons Strip */}
      <div className="px-4 py-4 grid grid-cols-4 gap-2.5">
        <button
          onClick={() => onStartNavigation(place)}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#005bbf] hover:bg-[#1a73e8] text-white active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            directions_car
          </span>
          <span className="text-[11px] font-bold mt-1">นำทาง</span>
        </button>

        <a
          href={place.phone ? `tel:${place.phone.replace(/-/g, '')}` : 'tel:022384007'}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#e6eeff] hover:bg-[#d8e2ff] text-[#121c2a] active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px] text-[#005bbf]">call</span>
          <span className="text-[11px] font-bold mt-1">โทร</span>
        </a>

        <button
          onClick={handleCopyShare}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#e6eeff] hover:bg-[#d8e2ff] text-[#121c2a] active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px] text-[#005bbf]">share</span>
          <span className="text-[11px] font-bold mt-1">แชร์</span>
        </button>

        <button
          onClick={() => onToggleTripItem(place.id)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all shadow-sm cursor-pointer active:scale-95 ${
            isInTrip
              ? 'bg-[#d8e2ff] text-[#005bbf] ring-1 ring-[#005bbf]'
              : 'bg-[#e6eeff] hover:bg-[#d8e2ff] text-[#121c2a]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px] text-[#005bbf]">
            {isInTrip ? 'task_alt' : 'playlist_add'}
          </span>
          <span className="text-[11px] font-bold mt-1">
            {isInTrip ? 'อยู่ในทริปแล้ว' : 'เพิ่มในทริป'}
          </span>
        </button>
      </div>

      {/* Quick Info Card */}
      <div className="px-4 space-y-2">
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#e6eeff] flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#005bbf] mt-0.5">
              location_on
            </span>
            <div className="flex flex-col flex-1">
              <span className="text-[12px] font-bold text-[#121c2a]">ที่อยู่และตำแหน่ง</span>
              <span className="text-[13px] text-[#414754] mt-0.5 leading-relaxed">
                {place.address}
              </span>
            </div>
          </div>

          <div className="h-px bg-[#d9e3f6]/60 w-full"></div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-[#005bbf] mt-0.5">
              styler
            </span>
            <div className="flex flex-col flex-1">
              <span className="text-[12px] font-bold text-[#121c2a]">ข้อปฏิบัติการเข้าชม</span>
              <span className="text-[13px] text-[#414754] mt-0.5 leading-relaxed">
                {place.etiquette ||
                  'กรุณาแต่งกายสุภาพเรียบร้อย ถอดรองเท้าก่อนเข้าพื้นที่ชั้นใน และรักษาความสงบเรียบร้อย'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Category Nearby Pins Radar */}
      <div className="mt-6 px-4">
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005bbf] animate-ping"></span>
              <h3 className="text-[16px] text-[#121c2a] font-bold">หมุดรอบข้างที่คุณเลือก</h3>
            </div>
            <span className="text-[11px] text-[#005bbf] font-bold">
              ระยะ 180 ม. – 1.5 กม.
            </span>
          </div>
          <p className="text-[12px] text-[#414754]">
            สำรวจจุดแวะพักต่อตามตัวกรองหมวดหมู่ที่เปิดใช้งานอยู่ในรัศมี
          </p>
        </div>

        {/* Mini Spatial Interactive Map Area */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-sm bg-[#dee9fc] mb-4 border border-[#e6eeff]">
          <div
            className="w-full h-full bg-cover bg-center filter saturate-150"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWLZFliKWFDOtC5CGRqYbqzmgv98IaLtPHlb2j7c3us44UrNj74n3K55aOVxP4gDtgu2rOY-goHyR4COjocmyP9I2qkuFJre_D_QzmSgACSc4siOSuOogk63bFePfqeRAm0Qr1cZkCGtSpAAiM1liZhs9rZ4u2ttf_mAVv526A9NKf32DvRXOAzOlmcT9GJKO9Ff3WphOCGENNamUUgcQAtGJht2GtR7GHIn-Q4d46sQsX6bAJ4k0')`,
            }}
          />

          {/* Floating Radial Radar Overlay */}
          <div className="absolute inset-0 bg-[#005bbf]/5 pointer-events-none flex items-center justify-center">
            <div
              className="w-40 h-40 rounded-full border-2 border-dashed border-[#005bbf]/30 animate-spin"
              style={{ animationDuration: '25s' }}
            ></div>
          </div>

          {/* Center Anchor: Wat Khaek */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#dc392c] text-white shadow-md flex items-center justify-center ring-4 ring-white">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {place.categoryIcon || 'temple_hindu'}
              </span>
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#121c2a]/90 text-white text-[11px] font-bold whitespace-nowrap shadow-sm">
              {place.name.split(' ')[0]} (จุดหลัก)
            </div>
          </div>

          {/* Surrounding Dynamic Dots on Mini Map */}
          {/* Dot 1: Cafe (Top-Left, 180m) */}
          <button
            onClick={() => handleHighlight('card-cafe', nearbyPlaceObjects[0])}
            className="absolute top-5 left-10 z-20 flex flex-col items-center group active:scale-95 transition-transform cursor-pointer"
            title="Luka Bangkok Cafe"
          >
            <div className="w-7 h-7 rounded-full bg-[#d97706] text-white shadow-md flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-[14px]">local_cafe</span>
            </div>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-full text-[#121c2a] font-bold shadow mt-0.5">
              180 ม.
            </span>
          </button>

          {/* Dot 2: Restaurant (Bottom-Left, 350m) */}
          <button
            onClick={() => handleHighlight('card-food', nearbyPlaceObjects[1])}
            className="absolute bottom-5 left-14 z-20 flex flex-col items-center group active:scale-95 transition-transform cursor-pointer"
            title="ประจักษ์เป็ดย่าง"
          >
            <div className="w-7 h-7 rounded-full bg-[#b81d17] text-white shadow-md flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-[14px]">restaurant</span>
            </div>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-full text-[#121c2a] font-bold shadow mt-0.5">
              350 ม.
            </span>
          </button>

          {/* Dot 3: Shopping (Top-Right, 1.1km) */}
          <button
            onClick={() => handleHighlight('card-shop', nearbyPlaceObjects[2])}
            className="absolute top-6 right-8 z-20 flex flex-col items-center group active:scale-95 transition-transform cursor-pointer"
            title="Silom Complex"
          >
            <div className="w-7 h-7 rounded-full bg-[#005bbf] text-white shadow-md flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
            </div>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-full text-[#121c2a] font-bold shadow mt-0.5">
              1.1 กม.
            </span>
          </button>

          {/* Dot 4: Mosque (Bottom-Right, 900m) */}
          <button
            onClick={() => handleHighlight('card-mosque', nearbyPlaceObjects[3])}
            className="absolute bottom-4 right-12 z-20 flex flex-col items-center group active:scale-95 transition-transform cursor-pointer"
            title="มัสยิดมิรซาฮิด"
          >
            <div className="w-7 h-7 rounded-full bg-[#006e2d] text-white shadow-md flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-[14px]">mosque</span>
            </div>
            <span className="text-[10px] bg-white px-1.5 py-0.2 rounded-full text-[#121c2a] font-bold shadow mt-0.5">
              900 ม.
            </span>
          </button>

          {/* Map Expand Indicator */}
          <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[#414754] text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-[#005bbf]">layers</span>
            <span>4 หมวดหมู่ที่ปักหมุด</span>
          </div>
        </div>

        {/* Cross-Category Recommendation Cards (List) */}
        <div className="flex flex-col gap-2.5 mb-10">
          {/* Item 1: Cafe */}
          <div
            id="card-cafe"
            className={`transition-all duration-300 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e6eeff] flex items-center gap-3 cursor-pointer ${
              highlightedCardId === 'card-cafe' ? 'bg-[#d8e2ff] ring-2 ring-[#005bbf]' : 'hover:bg-[#f8f9ff]'
            }`}
            onClick={() => {
              const luka = allPlaces.find((p) => p.id === 'luka-cafe');
              if (luka) onSelectNearbyPlace(luka);
            }}
          >
            <img
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkxVBZFByYZehS1UXoVk_NYMhyijfhl1waC6SLuQuE8LLqVNdV8Ba_FVDejF4qX18nzFcqQ9_OYZWyeYEOiWdRj6ggmkXktkgRg0zsfbLVu-Xwkz8uWHD-Wjk49alCsZz2PzncRKsVs1ujuYkpLGlPrN2sKExMFOzwlV7r0Gt_8j9t0p7QwyLkWcdqpH-O74dSFg4j38x3lTJtGoBI3uqmw10wyRFlvPz07_mgk8CPvfxRX-Zg0PQ"
              alt="Luka Bangkok Cafe"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 inline-flex items-center gap-1">
                  <span>☕ คาเฟ่</span>
                  <span>• 180 ม.</span>
                </span>
                <div className="flex items-center text-amber-500 font-bold">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[12px] text-[#121c2a] ml-0.5">4.6</span>
                </div>
              </div>
              <h4 className="text-[15px] font-bold text-[#121c2a] truncate mt-1">
                Luka Bangkok Cafe
              </h4>
              <span className="text-[12px] text-[#414754] truncate">
                อาหารเช้าบรันช์ • สเปเชียลตี้คอฟฟี่ • มีที่จอดรถ
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const luka = allPlaces.find((p) => p.id === 'luka-cafe');
                if (luka) onStartNavigation(luka);
              }}
              className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] flex items-center justify-center text-[#005bbf] flex-shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">turn_right</span>
            </button>
          </div>

          {/* Item 2: Restaurant */}
          <div
            id="card-food"
            className={`transition-all duration-300 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e6eeff] flex items-center gap-3 cursor-pointer ${
              highlightedCardId === 'card-food' ? 'bg-[#d8e2ff] ring-2 ring-[#005bbf]' : 'hover:bg-[#f8f9ff]'
            }`}
            onClick={() => {
              const duck = allPlaces.find((p) => p.id === 'prachak-duck');
              if (duck) onSelectNearbyPlace(duck);
            }}
          >
            <img
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk2DIbrxzSk1GiNh0RQsabqlTZmiVF9yjgEaf_LLdORuz9xSLHMCGDWwCvXrLNY8hg2SMcSH5_tANM08KkYILMAcrazw5wbhPQQqUW9F_6hlXgtDOgXf0IryXkyykvCuLavErJzOu0NeRQ1LQYWRws5H0XXDjjg_QTUlbmKjqnK6aQd6GWANFPnZD2UjZAHlFEKQqq-9qHhKGZibFrJsXFBndk5V1DVFbE0CAiG04bceE1St4tS1E"
              alt="ประจักษ์เป็ดย่าง บางรัก"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] inline-flex items-center gap-1">
                  <span>🍽️ ร้านอาหาร</span>
                  <span>• 350 ม.</span>
                </span>
                <div className="flex items-center text-amber-500 font-bold">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[12px] text-[#121c2a] ml-0.5">4.4</span>
                </div>
              </div>
              <h4 className="text-[15px] font-bold text-[#121c2a] truncate mt-1">
                ประจักษ์เป็ดย่าง บางรัก
              </h4>
              <span className="text-[12px] text-[#414754] truncate">
                ร้านระดับตำนาน 110 ปี • บะหมี่เกี๊ยวหมูกรอบ
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const duck = allPlaces.find((p) => p.id === 'prachak-duck');
                if (duck) onStartNavigation(duck);
              }}
              className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] flex items-center justify-center text-[#005bbf] flex-shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">turn_right</span>
            </button>
          </div>

          {/* Item 3: Shopping */}
          <div
            id="card-shop"
            className={`transition-all duration-300 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e6eeff] flex items-center gap-3 cursor-pointer ${
              highlightedCardId === 'card-shop' ? 'bg-[#d8e2ff] ring-2 ring-[#005bbf]' : 'hover:bg-[#f8f9ff]'
            }`}
            onClick={() => {
              const mall = allPlaces.find((p) => p.id === 'silom-complex');
              if (mall) onSelectNearbyPlace(mall);
            }}
          >
            <img
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOx6QqWo9hU8WSHIklTvVD3KDoUqyFK1PWpc0sBmv1Q6MALiCbXU0ClbhLiQ0SgaKOn3zuZrlJa3_GjxHnYGVl2jYGYdYmIEw_evHzatC7QXu1PXA22hBvGCHD-Pyw3t0kwAYAbJj3RPH2wet9oHBeqtap6QzitblWo5RUqXEanEuRNW9_-rDLe0Y9m2K7B9CuUdUIz0AjG1xBLTs60W8g_XQ7BCFiypikYkcA4BIBVR-5nzWwQd0"
              alt="Silom Complex"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#d8e2ff] text-[#001a41] inline-flex items-center gap-1">
                  <span>🛍️ ช้อปปิ้ง</span>
                  <span>• 1.1 กม.</span>
                </span>
                <div className="flex items-center text-amber-500 font-bold">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[12px] text-[#121c2a] ml-0.5">4.3</span>
                </div>
              </div>
              <h4 className="text-[15px] font-bold text-[#121c2a] truncate mt-1">
                Silom Complex
              </h4>
              <span className="text-[12px] text-[#414754] truncate">
                ศูนย์การค้าติดบีทีเอส • ท็อปส์ ซูเปอร์มาร์เก็ต
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const mall = allPlaces.find((p) => p.id === 'silom-complex');
                if (mall) onStartNavigation(mall);
              }}
              className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] flex items-center justify-center text-[#005bbf] flex-shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">turn_right</span>
            </button>
          </div>

          {/* Item 4: Mosque / Culture */}
          <div
            id="card-mosque"
            className={`transition-all duration-300 p-2.5 rounded-2xl bg-white shadow-sm border border-[#e6eeff] flex items-center gap-3 cursor-pointer ${
              highlightedCardId === 'card-mosque' ? 'bg-[#d8e2ff] ring-2 ring-[#005bbf]' : 'hover:bg-[#f8f9ff]'
            }`}
            onClick={() => {
              const mosque = allPlaces.find((p) => p.id === 'mirzaheed-mosque');
              if (mosque) onSelectNearbyPlace(mosque);
            }}
          >
            <div className="w-16 h-16 rounded-xl bg-[#7cf994]/30 flex items-center justify-center flex-shrink-0 text-[#006e2d]">
              <span className="material-symbols-outlined text-[32px]">mosque</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#7cf994]/30 text-[#007230] inline-flex items-center gap-1">
                  <span>🕌 ศาสนสถาน</span>
                  <span>• 900 ม.</span>
                </span>
                <div className="flex items-center text-amber-500 font-bold">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[12px] text-[#121c2a] ml-0.5">4.6</span>
                </div>
              </div>
              <h4 className="text-[15px] font-bold text-[#121c2a] truncate mt-1">
                มัสยิดมิรซาฮิด
              </h4>
              <span className="text-[12px] text-[#414754] truncate">
                มัสยิดประวัติศาสตร์ชุมชนสีลม • สงบร่มรื่น
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const mosque = allPlaces.find((p) => p.id === 'mirzaheed-mosque');
                if (mosque) onStartNavigation(mosque);
              }}
              className="w-9 h-9 rounded-full bg-[#eff4ff] hover:bg-[#d8e2ff] flex items-center justify-center text-[#005bbf] flex-shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">turn_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Floating Bottom Actions Bar */}
      <div className="fixed bottom-0 w-full bg-[#f8f9ff]/90 backdrop-blur-xl p-4 border-t border-[#c1c6d6]/30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center gap-2.5 z-40 max-w-lg mx-auto">
        <button
          onClick={onOpenTripModal}
          className="flex-1 py-3 px-3 rounded-full bg-[#dee9fc] hover:bg-[#d8e2ff] text-[#121c2a] font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px] text-[#005bbf]">add_road</span>
          <span>จัดทริปรอบจุดนี้</span>
        </button>

        <button
          onClick={() => onStartNavigation(place)}
          className="flex-1 py-3 px-4 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            navigation
          </span>
          <span>ปักหมุดนำทางทันที</span>
        </button>
      </div>
    </div>
  );
};
