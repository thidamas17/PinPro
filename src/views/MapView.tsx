import React, { useState, useMemo } from 'react';
import { Place, CategoryId, ViewTab } from '../types';
import { CATEGORIES } from '../data/placesData';
import { GoogleMapsSearchModal } from '../components/GoogleMapsSearchModal';

interface MapViewProps {
  places: Place[];
  selectedPlace: Place;
  onSelectPlace: (place: Place) => void;
  activeCategories: Set<CategoryId>;
  onToggleCategory: (catId: CategoryId) => void;
  onResetCategories: () => void;
  radiusKm: number;
  onCycleRadius: () => void;
  savedPlaceIds: Set<string>;
  onToggleBookmark: (placeId: string) => void;
  onNavigateToDetails: (place: Place) => void;
  onStartNavigation: (place: Place) => void;
  onNavigateToTab: (tab: ViewTab) => void;
  locationName: string;
  onShowToast: (msg: string) => void;
  onAddCustomPlace?: (place: Place) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  activeCategories,
  onToggleCategory,
  onResetCategories,
  radiusKm,
  onCycleRadius,
  savedPlaceIds,
  onToggleBookmark,
  onNavigateToDetails,
  onStartNavigation,
  onNavigateToTab,
  locationName,
  onShowToast,
  onAddCustomPlace,
}) => {
  const [isLayerSheetOpen, setIsLayerSheetOpen] = useState(false);
  const [isGmapsSearchOpen, setIsGmapsSearchOpen] = useState(false);

  // Type-to-Search State in Map View Status Bar
  const [mapSearchText, setMapSearchText] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Compute matching places based on search text
  const matchingPlaces = useMemo(() => {
    const q = mapSearchText.trim().toLowerCase();
    if (!q) return [];
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
    );
  }, [mapSearchText, places]);

  const handleSelectSearchResult = (place: Place) => {
    onSelectPlace(place);
    setMapCenter({ x: place.mapX, y: place.mapY });
    setCustomAreaName(place.name);
    setMapSearchText(place.name);
    setIsSearchDropdownOpen(false);
    onShowToast(`📍 พบและปักหมุดที่ "${place.name}" (${place.displayDistance})`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = mapSearchText.trim();
    if (!q) return;
    if (matchingPlaces.length > 0) {
      handleSelectSearchResult(matchingPlaces[0]);
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(
        q
      )}/@13.7462,100.5347,14z?entry=ttu`;
      window.open(url, '_blank', 'noopener,noreferrer');
      onShowToast(`กำลังค้นหา "${q}" บน Google Maps 100%`);
      setIsSearchDropdownOpen(false);
    }
  };

  // Filter categories to show in the horizontal strip
  const topCategories: CategoryId[] = [
    'restaurant',
    'cafe',
    'temple',
    'mall',
    'park',
    'hotel',
  ];

  // Calculate active pins count
  const activePinsCount = places.filter((p) => activeCategories.has(p.categoryId)).length;

  const isBookmarked = savedPlaceIds.has(selectedPlace.id);

  // Map imagery URL from user HTML
  const mapBgUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAbgIlItyc-9BKoz1BWkSqt0dtx2sa226B2ebNkuhrlFy0IvUSy_0VcpcHTU0xh9tgRrXuxKYClNydbrh9DvIbS7adQLGyvzfXLECI-8pMe_LikGy0JINQybm7Cil7J0-XTjHCGLFHrNoNZvEL1Pi0KpGRJ33CXB-OQLIcUcuhJPPoPo2Udlxmf4JRUnd9wvHHq2DsHnf_movOag1Nvi_qeWpdFFNy5CzALiRDPYzsjHkfCYuafgZw';

  // Custom picked coordinate on map (defaults to 50%, 50%)
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [customAreaName, setCustomAreaName] = useState<string | null>(null);
  const [isPinPickMode, setIsPinPickMode] = useState<boolean>(true);

  // Handle clicking on map canvas to set new center coordinate
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if clicked element was a button or pin marker
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(12, Math.min(88, ((e.clientY - rect.top) / rect.height) * 100));

    setMapCenter({ x, y });

    // Approximate district name based on Bangkok map quadrants
    let area = 'สยาม - ปทุมวัน';
    if (y < 38 && x < 45) area = 'พญาไท - ราชเทวี';
    else if (y < 42 && x > 55) area = 'ชิดลม - เพลินจิต';
    else if (y > 55 && x < 45) area = 'บางรัก - สีลม';
    else if (y > 55 && x >= 45) area = 'สาทร - สวนลุม';
    else if (x < 30) area = 'เจริญกรุง - พระนคร';
    else if (x > 70) area = 'สุขุมวิท - อโศก';

    setCustomAreaName(area);
    onShowToast(`📍 เลือกพิกัดศูนย์กลางใหม่ที่ "${area}" (แตะจุดอื่นเพื่อย้ายได้)`);
  };

  const handleResetToDefaultCenter = () => {
    setMapCenter({ x: 50, y: 50 });
    setCustomAreaName(null);
    onResetCategories();
    onShowToast(`คืนค่าพิกัดเริ่มต้นเป็น "${locationName}" เรียบร้อยแล้ว`);
  };

  return (
    <div className="flex flex-col w-full relative select-none pb-20 pt-16">
      {/* Dynamic Category Filter Floating Strip */}
      <section className="sticky top-16 z-30 w-full pt-1.5 pb-2 px-4 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#e6eeff]/60">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {topCategories.map((catId) => {
            const cat = CATEGORIES[catId];
            if (!cat) return null;
            const isActive = activeCategories.has(catId);

            return (
              <button
                key={catId}
                onClick={() => onToggleCategory(catId)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0 active:scale-95 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white shadow-sm ring-1 ring-[#c1c6d6]/50'
                    : 'bg-[#eff4ff] text-[#414754] opacity-70 hover:opacity-100'
                }`}
              >
                {!isActive && (
                  <span className="material-symbols-outlined text-[15px]">add</span>
                )}
                {isActive && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                )}
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ color: isActive ? cat.color : '#414754' }}
                >
                  {cat.icon}
                </span>
                <span className="text-[12px] font-semibold text-[#121c2a]">
                  {catId === 'restaurant'
                    ? 'ร้านอาหาร'
                    : catId === 'cafe'
                    ? 'คาเฟ่'
                    : catId === 'temple'
                    ? 'วัด/ศาสนสถาน'
                    : catId === 'mall'
                    ? 'ห้างสรรพสินค้า'
                    : catId === 'park'
                    ? 'สวนสาธารณะ'
                    : 'โรงแรม'}
                </span>
                {isActive && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                    }}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Manage Filter Settings */}
          <button
            onClick={() => onNavigateToTab('category-layers')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#dee9fc] text-[#414754] hover:text-[#121c2a] flex-shrink-0 active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span className="text-[11px] font-bold">
              จัดการ ({activeCategories.size})
            </span>
          </button>
        </div>

        {/* Active Filter Status Pill Overlay - Interactive Map Coordinate Selection & Google Maps 100% Live Search */}
        <div className="mt-1 flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 px-3 py-1.5 rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-[#005bbf]/30">
          {/* Type-to-Search Input Container - Enables typing to search places on the map */}
          <div className="relative flex items-center gap-1.5 flex-1 min-w-[210px] max-w-full">
            {/* Backdrop to close dropdown on outside tap */}
            {isSearchDropdownOpen && mapSearchText.trim().length > 0 && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setIsSearchDropdownOpen(false)}
              />
            )}

            <span className="material-symbols-outlined text-[17px] text-[#dc392c] animate-bounce flex-shrink-0">
              location_on
            </span>

            {/* Type-to-search form */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center flex-1 min-w-0">
              <span className="material-symbols-outlined absolute left-2.5 text-[#005bbf] text-[16px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={mapSearchText}
                onChange={(e) => {
                  setMapSearchText(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                onFocus={() => {
                  if (mapSearchText.trim()) setIsSearchDropdownOpen(true);
                }}
                placeholder={
                  customAreaName
                    ? `พิมพ์ค้นหาสถานที่ใน "${customAreaName}"...`
                    : `พิมพ์ค้นหาสถานที่ (เช่น วัดแขก, พารากอน, คาเฟ่)...`
                }
                className="w-full h-8 pl-8 pr-16 bg-[#eff4ff] hover:bg-[#e6eeff] focus:bg-white text-[#121c2a] placeholder:text-[#727785] text-[11px] font-medium rounded-full border border-[#005bbf]/25 focus:border-[#005bbf] focus:outline-none focus:ring-2 focus:ring-[#005bbf]/25 transition-all shadow-inner"
              />
              <div className="absolute right-1 flex items-center gap-0.5">
                {mapSearchText && (
                  <button
                    type="button"
                    onClick={() => {
                      setMapSearchText('');
                      setIsSearchDropdownOpen(false);
                    }}
                    className="w-5 h-5 rounded-full text-[#727785] hover:text-[#121c2a] hover:bg-[#dee9fc] flex items-center justify-center cursor-pointer"
                    title="ล้างข้อความ"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2 py-0.5 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white text-[10px] font-bold cursor-pointer active:scale-95 transition-transform"
                >
                  ค้นหา
                </button>
              </div>
            </form>

            {/* Instant Suggestion / Search Results Dropdown */}
            {isSearchDropdownOpen && mapSearchText.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-[#005bbf]/20 overflow-hidden z-50 max-h-64 overflow-y-auto no-scrollbar animate-fade-in">
                {matchingPlaces.length > 0 ? (
                  <div className="p-1.5 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-[#727785] flex items-center justify-between border-b border-[#e6eeff]">
                      <span>พบ {matchingPlaces.length} สถานที่</span>
                      <span className="text-[#005bbf]">แตะเพื่อไปที่พิกัด</span>
                    </div>
                    {matchingPlaces.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(place)}
                        className="w-full p-2 rounded-xl hover:bg-[#eff4ff] flex items-center justify-between text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={place.imageUrl}
                            alt={place.name}
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-[#e6eeff]"
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-[#121c2a] group-hover:text-[#005bbf] truncate">
                              {place.name}
                            </p>
                            <p className="text-[10px] text-[#727785] truncate">
                              {place.categoryLabel} • {place.district}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="text-[11px] font-bold text-[#005bbf]">
                            {place.displayDistance}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-[11px] text-[#414754] mb-2">
                      ไม่พบ &quot;{mapSearchText}&quot; ในหมุดปัจจุบัน
                    </p>
                    <button
                      type="button"
                      onClick={(e) => handleSearchSubmit(e)}
                      className="px-3 py-1.5 rounded-full bg-[#005bbf] text-white text-[11px] font-bold inline-flex items-center gap-1 shadow-sm hover:bg-[#1a73e8] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      <span>ค้นหา &quot;{mapSearchText}&quot; ใน Google Maps 100%</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Direct Google Maps 100% Search Trigger */}
            <button
              onClick={() => setIsGmapsSearchOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#1a73e8] to-[#005bbf] hover:from-[#1557b0] hover:to-[#004ba0] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              title="ค้นหาจาก Google Maps 100% เรียลไทม์"
            >
              <span className="material-symbols-outlined text-[15px]">travel_explore</span>
              <span className="whitespace-nowrap">ค้นหา Google Maps 100%</span>
            </button>

            {customAreaName && (
              <button
                onClick={handleResetToDefaultCenter}
                className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#005bbf] hover:bg-[#dee9fc] text-[10px] font-bold cursor-pointer"
                title="กลับพิกัดสยาม"
              >
                คืนค่าสยาม
              </button>
            )}

            <button
              onClick={handleResetToDefaultCenter}
              className="flex items-center gap-0.5 text-[#414754] hover:text-[#005bbf] active:scale-90 transition-all cursor-pointer p-0.5"
              title="รีเซ็ตตัวกรองทั้งหมด"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              <span className="text-[10px] font-semibold">รีเซ็ต</span>
            </button>
          </div>
        </div>
      </section>

      {/* High-Fidelity Interactive Map Canvas Section with Click-To-Pick Coordinates */}
      <div
        onClick={handleMapCanvasClick}
        className="relative w-full h-[400px] bg-[#d0dbed] overflow-hidden select-none cursor-crosshair group"
        title="แตะจุดใดก็ได้บนแผนที่เพื่อเลือกพิกัดศูนย์กลางใหม่"
      >
        {/* Static Map Base Imagery */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center filter saturate-105 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url('${mapBgUrl}')` }}
        />

        {/* Dynamic Hint Overlay on Map Hover/Tap */}
        <div className="absolute top-2.5 left-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-[#e6eeff] flex items-center gap-1.5 pointer-events-none text-[10px] font-semibold text-[#005bbf]">
          <span className="material-symbols-outlined text-[14px] text-[#dc392c]">touch_app</span>
          <span>แตะจุดใดบนแผนที่เพื่อเลือกพิกัดใหม่ได้ทันที</span>
        </div>

        {/* Radial Discovery Zone Indicator Overlay - follows mapCenter */}
        <div
          className="absolute pointer-events-none transition-all duration-300 ease-out flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${mapCenter.y}%`,
            left: `${mapCenter.x}%`,
            width: `${Math.min(360, 160 + radiusKm * 9)}px`,
            height: `${Math.min(360, 160 + radiusKm * 9)}px`,
          }}
        >
          <div className="w-full h-full rounded-full bg-[#1a73e8]/5 shadow-[0_0_0_1.5px_rgba(26,115,232,0.4)] border-2 border-dashed border-[#005bbf]/30 flex items-start justify-center pt-2 animate-pulse">
            <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#005bbf] font-bold text-[10px] shadow-sm">
              ขอบเขตรัศมี {radiusKm} กม.
            </span>
          </div>
        </div>

        {/* Central Selected Position Anchor - smoothly positions at mapCenter */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20 transition-all duration-300 ease-out"
          style={{
            top: `${mapCenter.y}%`,
            left: `${mapCenter.x}%`,
          }}
        >
          {/* Animated Callout Badge */}
          <div className="mb-1 px-2 py-0.5 rounded-full bg-[#27313f]/95 backdrop-blur-md text-[#eaf1ff] text-[10px] font-bold whitespace-nowrap shadow-lg flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#dc392c] animate-ping"></span>
            <span>{customAreaName ? `พิกัดที่เลือก: ${customAreaName}` : `ตำแหน่งคุณ (${locationName})`}</span>
          </div>

          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc392c] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#dc392c] shadow-[0_0_0_3px_#ffffff]"></span>
          </span>
        </div>

        {/* Interactive Map Pins */}
        {places.map((place) => {
          // Check if category is enabled
          if (!activeCategories.has(place.categoryId)) return null;

          const isSelected = place.id === selectedPlace.id;
          const cat = CATEGORIES[place.categoryId] || CATEGORIES.restaurant;

          return (
            <button
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className={`absolute -translate-x-1/2 -translate-y-full flex flex-col items-center transition-all cursor-pointer ${
                isSelected ? 'z-30 scale-105' : 'z-20 hover:scale-110 active:scale-110'
              }`}
              style={{
                top: `${place.mapY}%`,
                left: `${place.mapX}%`,
              }}
            >
              {/* Attached Callout Bubble for selected pin */}
              {isSelected && (
                <div className="mb-1 px-2.5 py-1 rounded-full bg-[#27313f]/95 backdrop-blur-md text-[#eaf1ff] shadow-xl flex items-center gap-1.5 animate-bounce">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span className="text-[11px] font-bold whitespace-nowrap">
                    {place.name.split(' ')[0]} ({place.displayDistance})
                  </span>
                </div>
              )}

              {/* Pin Head */}
              <div className="relative flex items-center justify-center">
                {isSelected && (
                  <div
                    className="absolute -inset-2 rounded-full animate-ping opacity-50"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                )}
                <div
                  className={`rounded-full flex items-center justify-center shadow-lg ring-2 ring-white transition-all ${
                    isSelected ? 'w-10 h-10 ring-4 ring-white' : 'w-7 h-7'
                  }`}
                  style={{ backgroundColor: cat.color, color: '#ffffff' }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: isSelected ? '20px' : '16px',
                      fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {place.categoryIcon || cat.icon}
                  </span>
                </div>
              </div>
              <div
                className="w-1.5 h-1.5 rotate-45 -mt-1 shadow-sm"
                style={{ backgroundColor: cat.color }}
              ></div>
            </button>
          );
        })}

        {/* Floating Map Control Tool Stack (Right Rail) */}
        <div className="absolute right-4 top-3 flex flex-col gap-2 z-20">
          {/* Layer Filter Toggle */}
          <button
            onClick={() => onNavigateToTab('category-layers')}
            className="relative w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#121c2a] active:scale-90 transition-transform cursor-pointer hover:bg-white"
            title="จัดการชั้นข้อมูล"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#005bbf] text-white text-[10px] flex items-center justify-center font-bold">
              {activeCategories.size}
            </span>
          </button>

          {/* Radius Adjuster Stepper */}
          <button
            onClick={onCycleRadius}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex flex-col items-center justify-center text-[#005bbf] active:scale-90 transition-transform cursor-pointer hover:bg-white"
            title="ปรับขนาดรัศมีการค้นหา"
          >
            <span className="text-[11px] font-bold leading-none">{radiusKm}</span>
            <span className="text-[8px] leading-tight">กม.</span>
          </button>

          {/* Recenter / GPS Button */}
          <button
            onClick={() => {
              setMapCenter({ x: 50, y: 50 });
              setCustomAreaName(null);
              onShowToast(`ปรับมุมมองและพิกัดศูนย์กลางกลับมาที่ "${locationName}"`);
            }}
            className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#005bbf] active:scale-90 transition-transform cursor-pointer hover:bg-white"
            title="พิกัดเริ่มต้นของคุณ"
          >
            <span className="material-symbols-outlined text-[20px]">gps_fixed</span>
          </button>

          {/* Compass Indicator */}
          <div className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#b81d17]">
            <span className="material-symbols-outlined text-[20px] rotate-45">explore</span>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Place Card Section (Slide-Up Discovery Peek) */}
      <section className="relative w-full -mt-4 z-20 bg-white rounded-t-[24px] shadow-2xl px-4 pt-2.5 pb-6 border-t border-[#e6eeff]">
        {/* Sheet Drag Handle */}
        <div className="w-10 h-1 rounded-full bg-[#c1c6d6]/70 mx-auto mb-3"></div>

        {/* Header Row of Bottom Sheet: Place Overview */}
        <div className="flex gap-3.5 items-start">
          {/* Thumbnail Image */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#dee9fc] shadow-xs">
            <img
              src={selectedPlace.imageUrl}
              alt={selectedPlace.name}
              className="w-full h-full object-cover"
            />
            {selectedPlace.isPopular && (
              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#7c3aed] text-white text-[9px] font-bold shadow-xs">
                ยอดนิยม
              </span>
            )}
          </div>

          {/* Main Content Details */}
          <div className="flex flex-col flex-grow min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-[#7c3aed]/12 text-[#7c3aed] text-[11px] font-bold flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {selectedPlace.categoryIcon || 'place'}
                </span>
                <span>{selectedPlace.categoryLabel.split('(')[0]}</span>
              </span>
              <span className="text-[11px] text-[#006e2d] font-bold flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006e2d]"></span>
                <span>{selectedPlace.isOpen ? 'เปิดอยู่' : 'ปิด'}</span>
              </span>
            </div>

            <h2 className="text-[16px] font-bold text-[#121c2a] truncate mt-1">
              {selectedPlace.name}
            </h2>

            <div className="flex items-center gap-2 mt-0.5 text-[#414754] flex-wrap text-[12px]">
              <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-[#121c2a]">{selectedPlace.rating}</span>
                <span className="text-[#727785] font-normal">
                  ({selectedPlace.reviewCount.toLocaleString()})
                </span>
              </div>
              <span className="text-[#c1c6d6]">•</span>
              <span className="text-[#414754]">
                {selectedPlace.closingTime ? `ปิด ${selectedPlace.closingTime}` : 'เปิดบริการ'}
              </span>
              <span className="text-[#c1c6d6]">•</span>
              <span className="text-[#005bbf] font-bold">
                {selectedPlace.displayDistance}
              </span>
            </div>
          </div>
        </div>

        {/* Contextual Proximity Chips (Cross-Category Discovery) */}
        <div className="mt-3 pt-2.5 bg-[#eff4ff]/80 rounded-xl p-2.5 border border-[#e6eeff]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold text-[#414754] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#005bbf]">
                hub
              </span>
              <span>หมุดจากหมวดหมู่อื่นในระยะเดินถึง:</span>
            </span>
            <button
              onClick={() => onShowToast('กำลังแสดงหมุดแนะนำรอบข้างบนแผนที่ ✨')}
              className="text-[10px] text-[#005bbf] font-bold hover:underline cursor-pointer"
            >
              ดูบนแผนที่
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Nearby Cafe Hint */}
            <button
              onClick={() => onShowToast('พบคอร์เนอร์คาเฟ่ 2 แห่งในระยะ 150 ม. (Luka Cafe & Factory Coffee)')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white shadow-xs text-[#121c2a] flex-shrink-0 active:scale-95 transition-transform cursor-pointer border border-[#e6eeff]"
            >
              <span className="material-symbols-outlined text-[15px] text-[#d97706]">
                local_cafe
              </span>
              <span className="text-[12px]">มี 2 คาเฟ่ใกล้เคียง</span>
              <span className="text-[12px] text-[#d97706] font-bold">(150 ม.)</span>
            </button>

            {/* Nearby Restaurant Hint */}
            <button
              onClick={() => onShowToast('พบ 4 ร้านอาหารรสเด็ดในระยะ 200 ม. (เจ๊ก้อย, ประจักษ์เป็ดย่าง, เจ๊โอว)')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white shadow-xs text-[#121c2a] flex-shrink-0 active:scale-95 transition-transform cursor-pointer border border-[#e6eeff]"
            >
              <span className="material-symbols-outlined text-[15px] text-[#ea580c]">
                restaurant
              </span>
              <span className="text-[12px]">4 ร้านอาหารรสเด็ด</span>
              <span className="text-[12px] text-[#ea580c] font-bold">(200 ม.)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2.5 mt-3.5">
          {/* Primary Route Button */}
          <button
            onClick={() => onStartNavigation(selectedPlace)}
            className="flex-1 h-11 px-4 rounded-xl bg-[#005bbf] hover:bg-[#1a73e8] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            <span>เส้นทางนำทาง</span>
          </button>

          {/* Secondary Detail Button */}
          <button
            onClick={() => onNavigateToDetails(selectedPlace)}
            className="h-11 px-4 rounded-xl bg-[#dee9fc] hover:bg-[#d8e2ff] text-[#121c2a] font-bold text-[13px] flex items-center justify-center gap-1 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span>รายละเอียด</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          {/* Bookmark Quick Action */}
          <button
            aria-label="บันทึกสถานที่"
            onClick={() => onToggleBookmark(selectedPlace.id)}
            className="h-11 w-11 rounded-xl bg-[#eff4ff] hover:bg-[#dee9fc] text-[#121c2a] flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform cursor-pointer border border-[#e6eeff]"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isBookmarked ? 'text-[#005bbf]' : 'text-[#414754]'
              }`}
              style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>
      </section>

      {/* Google Maps 100% Live Search Modal */}
      <GoogleMapsSearchModal
        isOpen={isGmapsSearchOpen}
        onClose={() => setIsGmapsSearchOpen(false)}
        locationName={locationName}
        customAreaName={customAreaName}
        radiusKm={radiusKm}
        onAddCustomPlace={(newPlace) => {
          if (onAddCustomPlace) {
            onAddCustomPlace(newPlace);
          }
          onSelectPlace(newPlace);
        }}
        onShowToast={onShowToast}
      />
    </div>
  );
};
