import React from 'react';
import { ViewTab } from '../types';

interface BottomNavProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  activeCategoriesCount: number;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  activeCategoriesCount,
  savedCount,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 bg-[#f8f9ff]/95 backdrop-blur-xl border-t border-[#c1c6d6]/30 shadow-[0_-4px_16px_rgba(18,28,42,0.06)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Map View */}
        <button
          onClick={() => onTabChange('map-view')}
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 transition-colors cursor-pointer ${
            currentTab === 'map-view' ? 'text-[#005bbf]' : 'text-[#414754] hover:text-[#121c2a]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={currentTab === 'map-view' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            explore
          </span>
          <span className={`text-[11px] mt-0.5 ${currentTab === 'map-view' ? 'font-bold' : 'font-medium'}`}>
            แผนที่
          </span>
        </button>

        {/* Tab 2: Category Layers */}
        <button
          onClick={() => onTabChange('category-layers')}
          className={`relative flex flex-col items-center justify-center min-w-[64px] h-12 transition-colors cursor-pointer ${
            currentTab === 'category-layers' ? 'text-[#005bbf]' : 'text-[#414754] hover:text-[#121c2a]'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[24px]"
              style={currentTab === 'category-layers' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              tune
            </span>
            {activeCategoriesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 bg-[#005bbf] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {activeCategoriesCount}
              </span>
            )}
          </div>
          <span className={`text-[11px] mt-0.5 ${currentTab === 'category-layers' ? 'font-bold' : 'font-medium'}`}>
            ตัวกรองชั้น
          </span>
        </button>

        {/* Tab 3: Places List */}
        <button
          onClick={() => onTabChange('places-list')}
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 transition-colors cursor-pointer ${
            currentTab === 'places-list' ? 'text-[#005bbf]' : 'text-[#414754] hover:text-[#121c2a]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={currentTab === 'places-list' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            view_list
          </span>
          <span className={`text-[11px] mt-0.5 ${currentTab === 'places-list' ? 'font-bold' : 'font-medium'}`}>
            รายการ
          </span>
        </button>

        {/* Tab 4: Saved Places */}
        <button
          onClick={() => onTabChange('saved-places')}
          className={`relative flex flex-col items-center justify-center min-w-[64px] h-12 transition-colors cursor-pointer ${
            currentTab === 'saved-places' ? 'text-[#005bbf]' : 'text-[#414754] hover:text-[#121c2a]'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[24px]"
              style={currentTab === 'saved-places' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              bookmark
            </span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 bg-[#b81d17] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {savedCount}
              </span>
            )}
          </div>
          <span className={`text-[11px] mt-0.5 ${currentTab === 'saved-places' ? 'font-bold' : 'font-medium'}`}>
            บันทึกไว้
          </span>
        </button>
      </div>
    </nav>
  );
};
