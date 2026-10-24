import React, { useState, useMemo } from 'react';
import { Place, CategoryId, SortMode, ViewTab } from '../types';
import { CATEGORIES } from '../data/placesData';

interface PlacesListViewProps {
  places: Place[];
  activeCategories: Set<CategoryId>;
  radiusKm: number;
  savedPlaceIds: Set<string>;
  onToggleBookmark: (placeId: string) => void;
  onSelectPlaceForMap: (place: Place) => void;
  onSelectPlaceForDetails: (place: Place) => void;
  onStartNavigation: (place: Place) => void;
  onNavigateToTab: (tab: ViewTab) => void;
  locationName: string;
  onShowToast: (msg: string) => void;
}

export const PlacesListView: React.FC<PlacesListViewProps> = ({
  places,
  activeCategories,
  radiusKm,
  savedPlaceIds,
  onToggleBookmark,
  onSelectPlaceForMap,
  onSelectPlaceForDetails,
  onStartNavigation,
  onNavigateToTab,
  locationName,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('distance');

  const sortOptions: { mode: SortMode; label: string }[] = [
    { mode: 'distance', label: 'ระยะทางใกล้สุด' },
    { mode: 'rating', label: 'คะแนนรีวิวสูงสุด' },
    { mode: 'popularity', label: 'ความนิยมล่าสุด' },
  ];

  const handleCycleSort = () => {
    const currentIndex = sortOptions.findIndex((opt) => opt.mode === sortMode);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    const next = sortOptions[nextIndex];
    setSortMode(next.mode);
    onShowToast(`จัดเรียงตาม: ${next.label}`);
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.mode === sortMode)?.label || 'ระยะทางใกล้สุด';

  // Filter & sort
  const filteredPlaces = useMemo(() => {
    return places
      .filter((p) => {
        // Must match active category
        if (!activeCategories.has(p.categoryId)) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDistrict = p.district.toLowerCase().includes(q);
          const matchCat = p.categoryLabel.toLowerCase().includes(q);
          return matchName || matchDistrict || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortMode === 'distance') {
          return a.distanceKm - b.distanceKm;
        } else if (sortMode === 'rating') {
          return b.rating - a.rating;
        } else {
          return b.reviewCount - a.reviewCount;
        }
      });
  }, [places, activeCategories, searchQuery, sortMode]);

  // Group by category group or sections
  const restaurantPlaces = filteredPlaces.filter((p) => p.categoryId === 'restaurant');
  const culturePlaces = filteredPlaces.filter((p) =>
    ['temple', 'mosque', 'church', 'museum'].includes(p.categoryId)
  );
  const cafePlaces = filteredPlaces.filter((p) => p.categoryId === 'cafe');
  const mallPlaces = filteredPlaces.filter((p) => p.categoryId === 'mall');
  const otherPlaces = filteredPlaces.filter(
    (p) =>
      !['restaurant', 'cafe', 'mall', 'temple', 'mosque', 'church', 'museum'].includes(
        p.categoryId
      )
  );

  const renderPlaceCard = (place: Place) => {
    const isBookmarked = savedPlaceIds.has(place.id);
    const cat = CATEGORIES[place.categoryId] || CATEGORIES.restaurant;

    return (
      <article
        key={place.id}
        onClick={() => onSelectPlaceForDetails(place)}
        className="flex flex-col bg-white rounded-2xl shadow-[0_3px_12px_rgba(18,28,42,0.05)] border border-[#e6eeff] overflow-hidden transition-all hover:border-[#adc7ff] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex p-3 gap-3">
          {/* Thumbnail with Category Pill Bar */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#dee9fc]">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            {place.badgeLabel && (
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[#b81d17] text-[10px] font-bold shadow-xs">
                {place.badgeLabel}
              </span>
            )}
          </div>

          {/* Content Details */}
          <div className="flex flex-col justify-between flex-grow min-w-0">
            <div>
              <div className="flex items-start justify-between gap-1">
                <h3 className="text-[15px] font-bold text-[#121c2a] truncate">
                  {place.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(place.id);
                  }}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                    isBookmarked
                      ? 'text-[#b81d17]'
                      : 'text-[#c1c6d6] hover:text-[#b81d17]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {isBookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>

              {/* Ratings & Distance */}
              <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
                <div className="flex items-center text-amber-500 font-bold">
                  <span
                    className="material-symbols-outlined text-[16px] text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[13px] ml-0.5 text-[#121c2a]">{place.rating}</span>
                </div>
                <span className="text-[#727785]">
                  ({place.reviewCount.toLocaleString()})
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c1c6d6]"></span>
                <span className="font-semibold text-[#005bbf] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">near_me</span>
                  {place.displayDistance}
                </span>
              </div>
            </div>

            {/* Operational & Subtitle */}
            <div className="flex items-center justify-between text-[11px] text-[#414754] mt-2">
              <span className="flex items-center gap-1 text-[#006e2d] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006e2d]"></span>
                {place.openStatus.split('•')[0] || 'เปิดบริการอยู่'}
              </span>
              <span className="text-[#727785] truncate max-w-[120px]">
                {place.district}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Footer Strip */}
        <div className="flex items-center justify-end gap-2 px-3 py-2 bg-[#eff4ff] border-t border-[#e6eeff]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectPlaceForMap(place);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#d8e2ff] text-[#121c2a] rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-transform cursor-pointer border border-[#e6eeff]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#005bbf]">map</span>
            <span>ดูบนแผนที่</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartNavigation(place);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-[#005bbf] hover:bg-[#1a73e8] text-white rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">navigation</span>
            <span>นำทางทันที</span>
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] pb-28 pt-16 select-none animate-fade-in">
      {/* Search & Active Filters Header Sticky Anchor */}
      <section className="sticky top-16 z-30 bg-[#f8f9ff]/95 backdrop-blur-xl px-4 pt-3 pb-3 space-y-2 border-b border-[#e6eeff]/80 shadow-[0_4px_20px_-4px_rgba(18,28,42,0.06)]">
        {/* Search Bar */}
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-[#414754] text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 bg-white text-[#121c2a] placeholder:text-[#727785] text-[13px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#e6eeff] focus:outline-none focus:ring-2 focus:ring-[#005bbf]/30 transition-shadow"
            placeholder="ค้นหาชื่อสถานที่ในหมวดที่เลือก..."
            type="text"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 w-6 h-6 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#414754] hover:text-[#121c2a] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          ) : (
            <button
              onClick={() => onShowToast('เปิดการค้นหาด้วยเสียงแล้ว (จำลอง)')}
              className="absolute right-2.5 w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#414754] active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">mic</span>
            </button>
          )}
        </div>

        {/* Active Filter Chips Summary */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          <button
            onClick={() => onNavigateToTab('category-layers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xs text-[#121c2a] text-[12px] font-semibold flex-shrink-0 active:scale-95 transition-transform border border-[#e6eeff] cursor-pointer"
          >
            <span>🍽️</span>
            <span>ร้านอาหาร</span>
            <span className="px-1.5 py-0.5 bg-[#ffdad5] text-[#410001] text-[11px] font-bold rounded-full">
              142
            </span>
          </button>

          <button
            onClick={() => onNavigateToTab('category-layers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xs text-[#121c2a] text-[12px] font-semibold flex-shrink-0 active:scale-95 transition-transform border border-[#e6eeff] cursor-pointer"
          >
            <span>☕</span>
            <span>คาเฟ่</span>
            <span className="px-1.5 py-0.5 bg-[#e6eeff] text-[#005bbf] text-[11px] font-bold rounded-full">
              85
            </span>
          </button>

          <button
            onClick={() => onNavigateToTab('category-layers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xs text-[#121c2a] text-[12px] font-semibold flex-shrink-0 active:scale-95 transition-transform border border-[#e6eeff] cursor-pointer"
          >
            <span>🛕</span>
            <span>ศาสนสถาน</span>
            <span className="px-1.5 py-0.5 bg-[#7ffc97]/40 text-[#002109] text-[11px] font-bold rounded-full">
              38
            </span>
          </button>

          <button
            onClick={() => onNavigateToTab('category-layers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-xs text-[#121c2a] text-[12px] font-semibold flex-shrink-0 active:scale-95 transition-transform border border-[#e6eeff] cursor-pointer"
          >
            <span>🛍️</span>
            <span>ห้างฯ</span>
            <span className="px-1.5 py-0.5 bg-[#d8e2ff] text-[#001a41] text-[11px] font-bold rounded-full">
              19
            </span>
          </button>
        </div>

        {/* Sorting & Radius Status Context Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[#414754] text-[12px]">
            <span className="w-2 h-2 rounded-full bg-[#006e2d] animate-pulse"></span>
            <span>
              พบรวม {filteredPlaces.length * 28 + 4} จุด ในรัศมี {radiusKm} กม.
            </span>
          </div>

          {/* Sort Toggle Trigger */}
          <button
            onClick={handleCycleSort}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#dee9fc] hover:bg-[#d8e2ff] text-[#121c2a] rounded-full text-[12px] font-bold active:opacity-75 transition-opacity cursor-pointer"
            id="sortToggleBtn"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005bbf]">swap_vert</span>
            <span id="currentSortLabel">{currentSortLabel}</span>
            <span className="material-symbols-outlined text-[14px] text-[#727785]">expand_more</span>
          </button>
        </div>
      </section>

      {/* Feed Content List */}
      <div className="flex flex-col gap-6 px-4 mt-4">
        {/* SECTION 1: RESTAURANTS */}
        {restaurantPlaces.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ffdad5] text-[#410001] shadow-xs">
                  <span className="text-[14px]">🍽️</span>
                </span>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-bold text-[#121c2a]">
                    ร้านอาหารยอดนิยมใกล้คุณ
                  </h2>
                  <span className="text-[11px] text-[#414754]">
                    แสดง {restaurantPlaces.length} จาก 142 แห่ง ในระยะทำการ
                  </span>
                </div>
              </div>
              <button
                onClick={() => onShowToast('กำลังแสดงหมวดร้านอาหารทั้งหมด 142 แห่ง')}
                className="text-[12px] font-bold text-[#005bbf] flex items-center gap-0.5 cursor-pointer hover:underline"
              >
                <span>ทั้งหมด</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-3">
              {restaurantPlaces.map(renderPlaceCard)}
            </div>
          </section>
        )}

        {/* SECTION 2: RELIGIOUS & CULTURAL SITES */}
        {culturePlaces.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#7ffc97]/40 text-[#002109] shadow-xs">
                  <span className="text-[14px]">🛕</span>
                </span>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-bold text-[#121c2a]">
                    วัด มัสยิด โบสถ์ ใกล้คุณ
                  </h2>
                  <span className="text-[11px] text-[#414754]">
                    แสดง {culturePlaces.length} จาก 38 แห่ง ในรัศมี {radiusKm} กม.
                  </span>
                </div>
              </div>
              <button
                onClick={() => onShowToast('กำลังแสดงหมวดศาสนสถานและวัฒนธรรมทั้งหมด 38 แห่ง')}
                className="text-[12px] font-bold text-[#005bbf] flex items-center gap-0.5 cursor-pointer hover:underline"
              >
                <span>ทั้งหมด</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-3">
              {culturePlaces.map(renderPlaceCard)}
            </div>
          </section>
        )}

        {/* SECTION 3: CAFES & BEVERAGES */}
        {cafePlaces.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e6eeff] text-[#005bbf] shadow-xs">
                  <span className="text-[14px]">☕</span>
                </span>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-bold text-[#121c2a]">
                    คาเฟ่ & สเปเชียลตี้คอฟฟี่
                  </h2>
                  <span className="text-[11px] text-[#414754]">
                    แสดง {cafePlaces.length} จาก 85 แห่ง ในรัศมี {radiusKm} กม.
                  </span>
                </div>
              </div>
              <button
                onClick={() => onShowToast('กำลังแสดงหมวดคาเฟ่ทั้งหมด 85 แห่ง')}
                className="text-[12px] font-bold text-[#005bbf] flex items-center gap-0.5 cursor-pointer hover:underline"
              >
                <span>ทั้งหมด</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-3">
              {cafePlaces.map(renderPlaceCard)}
            </div>
          </section>
        )}

        {/* SECTION 4: SHOPPING & LIFESTYLE */}
        {mallPlaces.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#d8e2ff] text-[#001a41] shadow-xs">
                  <span className="text-[14px]">🛍️</span>
                </span>
                <div className="flex flex-col">
                  <h2 className="text-[15px] font-bold text-[#121c2a]">
                    ห้างสรรพสินค้า & ช้อปปิ้ง
                  </h2>
                  <span className="text-[11px] text-[#414754]">
                    แสดง {mallPlaces.length} จาก 19 แห่ง ในรัศมี {radiusKm} กม.
                  </span>
                </div>
              </div>
              <button
                onClick={() => onShowToast('กำลังแสดงหมวดห้างสรรพสินค้าทั้งหมด 19 แห่ง')}
                className="text-[12px] font-bold text-[#005bbf] flex items-center gap-0.5 cursor-pointer hover:underline"
              >
                <span>ทั้งหมด</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="space-y-3">
              {mallPlaces.map(renderPlaceCard)}
            </div>
          </section>
        )}

        {/* Any Other filtered items */}
        {otherPlaces.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <h2 className="text-[15px] font-bold text-[#121c2a]">สถานที่อื่นๆ</h2>
            <div className="space-y-3">
              {otherPlaces.map(renderPlaceCard)}
            </div>
          </section>
        )}

        {filteredPlaces.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e6eeff]">
            <span className="material-symbols-outlined text-[36px] text-[#727785]">search_off</span>
            <p className="text-[14px] font-bold text-[#121c2a] mt-2">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</p>
            <p className="text-[12px] text-[#727785] mt-1">ลองเปลี่ยนคำค้นหา หรือเปิดตัวกรองหมวดหมู่เพิ่มเติม</p>
            <button
              onClick={() => onNavigateToTab('category-layers')}
              className="mt-3 px-4 py-2 bg-[#005bbf] text-white rounded-full text-[12px] font-bold"
            >
              ปรับแต่งตัวกรองชั้น
            </button>
          </div>
        )}
      </div>

      {/* Bottom Floating Call-To-Action Button for Map View Transition */}
      <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
        <button
          onClick={() => onNavigateToTab('map-view')}
          className="pointer-events-auto h-12 px-6 bg-[#27313f] text-[#eaf1ff] font-bold text-[13px] rounded-full shadow-[0_8px_24px_rgba(18,28,42,0.30)] flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer hover:bg-[#121c2a]"
        >
          <span className="material-symbols-outlined text-[20px] text-[#7ffc97]">map</span>
          <span>ดูหมุดทั้งหมด {filteredPlaces.length * 28 + 4} จุดบนแผนที่</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[11px] text-[#eaf1ff] font-bold">
            {radiusKm} กม.
          </span>
        </button>
      </div>
    </div>
  );
};
