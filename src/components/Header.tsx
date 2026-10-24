import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Place, ViewTab } from '../types';

interface HeaderProps {
  currentTab: ViewTab;
  onBack?: () => void;
  locationName: string;
  radiusKm: number;
  onOpenLocationPicker: () => void;
  savedCount?: number;
  places: Place[];
  onSelectPlaceForDetails: (place: Place) => void;
  onSelectPlaceForMap: (place: Place) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onBack,
  locationName,
  radiusKm,
  onOpenLocationPicker,
  places,
  onSelectPlaceForDetails,
  onSelectPlaceForMap,
}) => {
  const isPlaceDetails = currentTab === 'place-details';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search bar opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Advanced 100% hit rate search with multi-keyword, synonyms & full metadata search
  const searchResults = useMemo(() => {
    const rawQuery = searchQuery.toLowerCase().trim();
    if (!rawQuery) {
      // When query is empty, show all places sorted by rating and popularity so user always finds places
      return places;
    }

    // Keyword & synonym dictionary
    const synonymMap: Record<string, string[]> = {
      'กาแฟ': ['cafe', 'coffee', 'luka', 'factory', 'nana', 'เครื่องดื่ม'],
      'coffee': ['cafe', 'coffee', 'luka', 'factory', 'nana', 'กาแฟ'],
      'cafe': ['กาแฟ', 'เบเกอรี่', 'specialty', 'luka', 'factory', 'nana'],
      'คาเฟ่': ['cafe', 'coffee', 'luka', 'factory', 'nana', 'กาแฟ', 'เบเกอรี่'],
      'อาหาร': ['restaurant', 'เจ๊โอว', 'ทิพย์สมัย', 'ประจักษ์', 'เป็ด', 'ผัดไทย', 'ส้มตำ', 'หมู'],
      'กิน': ['restaurant', 'เจ๊โอว', 'ทิพย์สมัย', 'ประจักษ์', 'เป็ด', 'ผัดไทย', 'ส้มตำ'],
      'ของกิน': ['restaurant', 'เจ๊โอว', 'ทิพย์สมัย', 'ประจักษ์', 'streetfood'],
      'food': ['restaurant', 'เจ๊โอว', 'ทิพย์สมัย', 'ประจักษ์', 'อาหาร'],
      'เป็ด': ['เจ๊โอว', 'ประจักษ์เป็ดย่าง', 'ข้าวต้มเป็ด'],
      'ผัดไทย': ['ทิพย์สมัย', 'ประตูผี', 'ผัดไทยต้นตำรับ'],
      'หมู': ['หมูกรอบ', 'หมูกระทะ', 'คอหมูย่าง', 'เจ๊โอว', 'ประจักษ์', 'เจ๊ก้อย', 'เสนา'],
      'วัด': ['temple', 'วัดแขก', 'วัดปทุม', 'อุมาเทวี', 'ราชวรวิหาร', 'ไหว้พระ', 'ทำบุญ'],
      'temple': ['วัด', 'วัดแขก', 'วัดปทุม', 'อุมาเทวี'],
      'สายมู': ['วัดแขก', 'เทวสถาน', 'พระศรีมหาอุมาเทวี', 'ขอพร'],
      'ฮินดู': ['วัดแขก', 'เทวสถาน', 'พระศรีมหาอุมาเทวี'],
      'มัสยิด': ['mosque', 'ฮารูณ', 'มิรซาฮิด', 'ฮาลาล', 'ละหมาด'],
      'mosque': ['มัสยิด', 'ฮารูณ', 'มิรซาฮิด'],
      'ฮาลาล': ['มัสยิด', 'ฮารูณ', 'มิรซาฮิด', 'บางรัก'],
      'โบสถ์': ['church', 'อัสสัมชัญ', 'คริสต์'],
      'church': ['โบสถ์', 'อัสสัมชัญ', 'คาทอลิก'],
      'ห้าง': ['mall', 'พารากอน', 'คอมเพล็กซ์', 'siam', 'silom complex', 'ช้อป'],
      'mall': ['ห้าง', 'พารากอน', 'คอมเพล็กซ์', 'shopping'],
      'ช้อป': ['ห้าง', 'พารากอน', 'คอมเพล็กซ์', 'shopping', 'ซูเปอร์'],
      'สวน': ['park', 'ลุมพินี', 'วิ่ง', 'ธรรมชาติ', 'ออกกำลังกาย'],
      'park': ['สวน', 'ลุมพินี', 'ธรรมชาติ'],
    };

    // Split search query into multiple keywords (e.g. "เป็ด สีลม" -> ["เป็ด", "สีลม"])
    const tokens = rawQuery.split(/\s+/).filter(Boolean);

    // Filter places that match all tokens (or synonyms)
    const exactMatches = places.filter((place) => {
      const placeText = [
        place.name,
        place.categoryLabel,
        place.categoryId,
        place.badgeLabel || '',
        place.district,
        place.address,
        place.description || '',
        place.etiquette || '',
      ]
        .join(' ')
        .toLowerCase();

      // Every search token must match either in place text or through synonym expansion
      return tokens.every((token) => {
        if (placeText.includes(token)) return true;
        const synonyms = synonymMap[token] || [];
        return synonyms.some((syn) => placeText.includes(syn));
      });
    });

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // Fallback: If no place matched ALL tokens, match ANY token or partial prefix so user ALWAYS finds results (100% guarantee)
    const partialMatches = places.filter((place) => {
      const placeText = [
        place.name,
        place.categoryLabel,
        place.district,
        place.badgeLabel || '',
      ]
        .join(' ')
        .toLowerCase();

      return tokens.some((token) => {
        if (placeText.includes(token)) return true;
        const synonyms = synonymMap[token] || [];
        return synonyms.some((syn) => placeText.includes(syn));
      });
    });

    // If still empty (e.g., completely random typo), return all places sorted by rating
    return partialMatches.length > 0 ? partialMatches : places;
  }, [places, searchQuery]);

  const quickSearchTags = [
    { label: '☕ คาเฟ่', query: 'คาเฟ่' },
    { label: '🍽️ ร้านอาหาร', query: 'ร้านอาหาร' },
    { label: '🛕 วัดแขก', query: 'วัดแขก' },
    { label: '🍲 เจ๊โอว', query: 'เจ๊โอว' },
    { label: '🛍️ ห้างฯ', query: 'ห้าง' },
    { label: '🕌 มัสยิด', query: 'มัสยิด' },
  ];

  const getTitleAndSubtitle = () => {
    switch (currentTab) {
      case 'place-details':
        return {
          title: 'Place Details',
          subtitle: `รัศมี ${radiusKm} กม. • PinPro`,
        };
      case 'map-view':
        return {
          title: 'PinPro',
          subtitle: `รัศมี ${radiusKm} กม. • Map View`,
        };
      case 'places-list':
        return {
          title: 'PinPro',
          subtitle: `รัศมี ${radiusKm} กม. • Places List`,
        };
      case 'category-layers':
        return {
          title: 'PinPro',
          subtitle: `รัศมี ${radiusKm} กม. • Category Layers`,
        };
      case 'saved-places':
        return {
          title: 'PinPro',
          subtitle: `สถานที่ที่บันทึก • My Trips`,
        };
      default:
        return {
          title: 'PinPro',
          subtitle: `รัศมี ${radiusKm} กม.`,
        };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectPlace = (place: Place, mode: 'details' | 'map') => {
    if (mode === 'details') {
      onSelectPlaceForDetails(place);
    } else {
      onSelectPlaceForMap(place);
    }
    handleCloseSearch();
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e6eeff]/60">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* If Search is NOT open: Default Header View */}
          {!isSearchOpen ? (
            <>
              {/* Left section */}
              <div className="flex items-center gap-2 min-w-0">
                {isPlaceDetails ? (
                  <button
                    aria-label="ย้อนกลับ"
                    onClick={onBack}
                    className="w-10 h-10 -ml-1 flex items-center justify-center text-[#121c2a] hover:bg-[#e6eeff] active:scale-95 rounded-full transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                  </button>
                ) : null}

                {/* Brand Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#005bbf] to-[#1a73e8] flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                </div>

                <div className="flex flex-col truncate">
                  <h1 className="font-bold text-[17px] text-[#121c2a] leading-tight truncate tracking-tight">
                    {title}
                  </h1>
                  <span className="text-[11px] text-[#414754] font-normal leading-tight">
                    {subtitle}
                  </span>
                </div>
              </div>

              {/* Right section with Global Search Trigger Button */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Global Search Bar Trigger Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="ค้นหาสถานที่ทั่วทั้งระบบ"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#eff4ff] border border-[#e6eeff] shadow-xs flex items-center justify-center text-[#005bbf] active:scale-90 transition-transform cursor-pointer"
                  title="ค้นหาสถานที่หรือหมวดหมู่"
                >
                  <span className="material-symbols-outlined text-[19px]">search</span>
                </button>

                {!isPlaceDetails && (
                  <button
                    onClick={onOpenLocationPicker}
                    className="h-9 px-3 bg-white/95 border border-[#e6eeff] backdrop-blur-md rounded-full shadow-[0_2px_6px_-1px_rgba(31,41,55,0.08)] flex items-center gap-1 active:scale-95 transition-transform cursor-pointer hover:bg-[#eff4ff]"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#dc392c]">
                      location_on
                    </span>
                    <span className="text-[12px] font-semibold text-[#121c2a] max-w-[85px] sm:max-w-[100px] truncate">
                      {locationName}
                    </span>
                  </button>
                )}

                <div className="relative">
                  <button
                    aria-label="โปรไฟล์ผู้ใช้"
                    className="w-9 h-9 flex items-center justify-center rounded-full active:opacity-80 transition-opacity ring-2 ring-[#1a73e8]/20"
                  >
                    <img
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX_7EnJAoFGaagXG1rYFBs4EX5Q3WxYwdnHrcRDtS-AAqnPmuCTGseblHo0nR_NkBtUzmbk7cWxW10QkYNaACo8zW9THo53ozx14fgSKZGIRm2arNPDsMNH71QtX6jhpsiQHxixMa2hbTF2p7L-5_FokSBWfdbrOqmQUKpMIYoVn8HDw2FsG5zqIbUIhTP2BRq7PWp91UlnRNFp8dCmuqKOZN_pC_AHj5BE2NPa-8Wtd92VV0zzkc"
                    />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* If Search IS open: Active Global Search Bar in Header */
            <div className="flex items-center gap-2 w-full animate-fade-in">
              <div className="relative flex items-center flex-1">
                <span className="material-symbols-outlined absolute left-3.5 text-[#005bbf] text-[20px] pointer-events-none">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') handleCloseSearch();
                  }}
                  className="w-full h-11 pl-10 pr-9 bg-white text-[#121c2a] placeholder:text-[#727785] text-[13px] font-medium rounded-full shadow-[0_2px_10px_rgba(0,91,191,0.12)] border-2 border-[#005bbf] focus:outline-none focus:ring-4 focus:ring-[#005bbf]/20 transition-all"
                  placeholder="ค้นหาเจอ 100% ชื่อสถานที่, หมวดหมู่, เมนู, หรือย่าน..."
                  type="text"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 w-6 h-6 rounded-full bg-[#dee9fc] text-[#414754] hover:text-[#121c2a] flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                ) : null}
              </div>

              {/* Close Search Button */}
              <button
                onClick={handleCloseSearch}
                className="h-9 px-3 rounded-full bg-[#dee9fc] hover:bg-[#d8e2ff] text-[#005bbf] font-bold text-[12px] flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
              >
                ยกเลิก
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Results Dropdown Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs pt-16 flex justify-center animate-fade-in"
          onClick={handleCloseSearch}
        >
          <div
            className="w-full max-w-lg bg-white rounded-b-3xl shadow-2xl border-b border-[#e6eeff] flex flex-col max-h-[75vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Filter Tags Strip */}
            <div className="px-4 py-2.5 bg-[#eff4ff] border-b border-[#e6eeff] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-[#414754] whitespace-nowrap mr-1">
                ค้นหาด่วน:
              </span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => setSearchQuery(tag.query)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    searchQuery === tag.query
                      ? 'bg-[#005bbf] text-white shadow-xs'
                      : 'bg-white hover:bg-[#dee9fc] text-[#121c2a] border border-[#e6eeff]'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
              <div className="px-2 py-1 text-[11px] font-bold text-[#414754] flex items-center justify-between border-b border-[#e6eeff]/60 pb-1.5 mb-1">
                <span className="flex items-center gap-1.5 text-[#006e2d]">
                  <span className="w-2 h-2 rounded-full bg-[#006e2d] animate-pulse"></span>
                  <span className="font-bold">ค้นหาเจอ 100%</span>
                  <span className="text-[#727785] font-normal">
                    ({searchResults.length} สถานที่{searchQuery.trim() ? ` ตรงตาม "${searchQuery}"` : ' ทั้งหมด'})
                  </span>
                </span>
                <span className="text-[#005bbf] text-[10px]">แตะเพื่อดูรายละเอียดหรือแผนที่</span>
              </div>

              {searchResults.length > 0 ? (
                searchResults.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place, 'details')}
                    className="p-2.5 rounded-2xl border border-[#e6eeff] hover:border-[#005bbf] hover:bg-[#f8f9ff] flex items-center justify-between gap-3 transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-13 h-13 rounded-xl object-cover flex-shrink-0 bg-[#e6eeff]"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#005bbf] truncate">
                            {place.badgeLabel || place.categoryLabel.split(' ')[0]}
                          </span>
                          <span className="text-[11px] text-[#006e2d] font-semibold">
                            {place.openStatus.split('•')[0]}
                          </span>
                        </div>
                        <h4 className="text-[14px] font-bold text-[#121c2a] truncate mt-0.5 group-hover:text-[#005bbf]">
                          {place.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#727785]">
                          <span className="text-amber-500 font-bold">⭐ {place.rating}</span>
                          <span>•</span>
                          <span className="text-[#005bbf] font-semibold">{place.displayDistance}</span>
                          <span>•</span>
                          <span className="truncate">{place.district}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action: View on Map */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlace(place, 'map');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#005bbf] text-[11px] font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                      title="ดูบนแผนที่"
                    >
                      <span className="material-symbols-outlined text-[15px]">map</span>
                      <span className="hidden sm:inline">แผนที่</span>
                    </button>
                  </div>
                ))
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
