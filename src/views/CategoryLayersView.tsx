import React from 'react';
import { CategoryId, ViewTab } from '../types';
import { CATEGORIES, LAYER_GROUPS, RADIUS_PRESETS } from '../data/placesData';

interface CategoryLayersViewProps {
  activeCategories: Set<CategoryId>;
  onToggleCategory: (catId: CategoryId) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onResetDefaults: () => void;
  onToggleGroup: (categoryIds: CategoryId[]) => void;
  radiusStep: number;
  onSetRadiusStep: (step: number) => void;
  filterOpenNow: boolean;
  onToggleOpenNow: () => void;
  filterRating4Plus: boolean;
  onToggleRating4Plus: () => void;
  onNavigateToTab: (tab: ViewTab) => void;
  onShowToast: (msg: string) => void;
}

export const CategoryLayersView: React.FC<CategoryLayersViewProps> = ({
  activeCategories,
  onToggleCategory,
  onSelectAll,
  onClearAll,
  onResetDefaults,
  onToggleGroup,
  radiusStep,
  onSetRadiusStep,
  filterOpenNow,
  onToggleOpenNow,
  filterRating4Plus,
  onToggleRating4Plus,
  onNavigateToTab,
  onShowToast,
}) => {
  const currentRadiusData = RADIUS_PRESETS[radiusStep] || RADIUS_PRESETS[3];

  // Calculate total selected count and pins count
  let totalActivePins = 0;
  activeCategories.forEach((catId) => {
    const cat = CATEGORIES[catId];
    if (cat) totalActivePins += cat.count;
  });

  const activeGroupCount = LAYER_GROUPS.filter((group) =>
    group.categoryIds.some((id) => activeCategories.has(id))
  ).length;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9ff] px-4 pb-36 pt-16 gap-4 select-none animate-fade-in max-w-lg mx-auto">
      {/* Content Header & Scope Briefing */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8e2ff] text-[#001a41] text-[11px] font-bold shadow-xs">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              layers
            </span>
            <span>การจัดการเลเยอร์เชิงพื้นที่</span>
          </span>
          <span className="text-[12px] font-bold text-[#005bbf] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">pin_drop</span>
            <span>พร้อมใช้งาน 4 กลุ่มหลัก</span>
          </span>
        </div>

        <h1 className="text-[22px] font-extrabold text-[#121c2a] tracking-tight">
          ตัวกรองหลายหมวดหมู่บนแผนที่
        </h1>
        <p className="text-[13px] text-[#414754] leading-relaxed">
          เลือกเปิด-ปิดหมวดหมู่ที่ต้องการแสดงผลพร้อมกันในรัศมี {currentRadiusData.text} เพื่อค้นหาจุดหมายตรงใจ
        </p>

        {/* Quick Action Chips */}
        <div className="flex items-center gap-2 mt-1 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => {
              onSelectAll();
              onShowToast('เปิดใช้งานทุกหมวดหมู่แล้ว');
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#dee9fc] hover:bg-[#d8e2ff] text-[#121c2a] text-[12px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            id="btn-select-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#005bbf]">done_all</span>
            <span>เลือกทั้งหมด</span>
          </button>

          <button
            onClick={() => {
              onClearAll();
              onShowToast('ล้างตัวเลือกทั้งหมดแล้ว');
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#ffdad6] text-[#414754] hover:text-[#ba1a1a] text-[12px] font-semibold active:scale-95 transition-all cursor-pointer border border-[#e6eeff]"
            id="btn-clear-all"
          >
            <span className="material-symbols-outlined text-[16px]">clear_all</span>
            <span>ล้างตัวเลือกทั้งหมด</span>
          </button>

          <button
            onClick={() => {
              onResetDefaults();
              onShowToast('คืนค่าเริ่มต้นเรียบร้อยแล้ว');
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dee9fc] text-[#414754] text-[12px] font-semibold active:scale-95 transition-all cursor-pointer border border-[#e6eeff]"
            id="btn-reset-default"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>คืนค่าเริ่มต้น</span>
          </button>
        </div>
      </div>

      {/* Radius Slider Control Section */}
      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white shadow-[0_4px_16px_-2px_rgba(18,28,42,0.06)] border border-[#e6eeff] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#005bbf]">
              <span className="material-symbols-outlined text-[18px]">radar</span>
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#121c2a] block">
                ระยะทางค้นหารอบตัว
              </span>
              <span className="text-[12px] font-bold text-[#005bbf]" id="radius-label">
                {currentRadiusData.text} ({currentRadiusData.description})
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#e6eeff] text-[#005bbf] text-[12px] font-bold shadow-xs">
            {radiusStep <= 2 ? 'รัศมีใกล้' : radiusStep === 3 ? 'รัศมีกว้าง' : 'ทั่วเมือง'}
          </span>
        </div>

        {/* Interactive Range Slider */}
        <div className="flex flex-col px-1 pt-2">
          <input
            className="w-full h-2 rounded-lg bg-[#dee9fc] appearance-none cursor-pointer accent-[#005bbf] focus:outline-none"
            id="radius-slider"
            max="5"
            min="1"
            step="1"
            type="range"
            value={radiusStep}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onSetRadiusStep(val);
              onShowToast(`ตั้งรัศมีเป็น ${RADIUS_PRESETS[val]?.text}`);
            }}
          />

          {/* Notch Labels */}
          <div className="flex justify-between items-center mt-2 px-0.5 text-[#414754] text-[11px]">
            {[1, 2, 3, 4, 5].map((step) => {
              const isActive = step === radiusStep;
              return (
                <button
                  key={step}
                  onClick={() => {
                    onSetRadiusStep(step);
                    onShowToast(`ตั้งรัศมีเป็น ${RADIUS_PRESETS[step]?.text}`);
                  }}
                  type="button"
                  className={`transition-colors cursor-pointer ${
                    isActive ? 'text-[#005bbf] font-extrabold text-[12px]' : 'hover:text-[#005bbf]'
                  }`}
                >
                  {RADIUS_PRESETS[step]?.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Dynamic Counter Badge */}
        <div className="flex items-center justify-between mt-1 px-3 py-2 rounded-xl bg-[#eff4ff]">
          <div className="flex items-center gap-1.5 text-[#414754] text-[12px]">
            <span className="material-symbols-outlined text-[16px] text-[#006e2d]">
              verified
            </span>
            <span>ครอบคลุมเขตเมืองและปริมณฑล</span>
          </div>
          <span className="text-[12px] font-bold text-[#121c2a]" id="counter-summary">
            พบ {currentRadiusData.totalBase} สถานที่
          </span>
        </div>
      </div>

      {/* Additional Filter Toggles Card */}
      <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white shadow-[0_2px_8px_rgba(18,28,42,0.04)] border border-[#e6eeff]">
        <span className="text-[11px] font-bold text-[#727785] uppercase tracking-wider mb-1">
          เงื่อนไขพิเศษเพิ่มเติม
        </span>

        {/* Open Now Switch */}
        <label className="flex items-center justify-between py-2 cursor-pointer select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7cf994]/30 flex items-center justify-center text-[#006e2d]">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#121c2a] leading-tight">
                แสดงเฉพาะที่เปิดให้บริการอยู่ตอนนี้
              </span>
              <span className="text-[12px] text-[#414754]">
                คัดกรองสถานที่ปิดทำการในเวลาปัจจุบันออก
              </span>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              checked={filterOpenNow}
              onChange={() => {
                onToggleOpenNow();
                onShowToast(filterOpenNow ? 'แสดงสถานที่ทั้งหมด' : 'แสดงเฉพาะสถานที่ที่เปิดบริการ');
              }}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-11 h-6 bg-[#dee9fc] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005bbf]"></div>
          </div>
        </label>

        <div className="h-[1px] w-full bg-[#e6eeff]"></div>

        {/* 4.0+ Stars Switch */}
        <label className="flex items-center justify-between py-2 cursor-pointer select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ffdad5] flex items-center justify-center text-[#b81d17]">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#121c2a] leading-tight">
                คะแนนรีวิว 4.0 ดาวขึ้นไปเท่านั้น
              </span>
              <span className="text-[12px] text-[#414754]">
                เฉพาะสถานที่ระดับคุณภาพยอดนิยม
              </span>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              checked={filterRating4Plus}
              onChange={() => {
                onToggleRating4Plus();
                onShowToast(filterRating4Plus ? 'แสดงคะแนนทุกระดับ' : 'แสดงเฉพาะ 4.0 ดาวขึ้นไป');
              }}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-11 h-6 bg-[#dee9fc] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005bbf]"></div>
          </div>
        </label>
      </div>

      {/* Category Layer Groups List */}
      <div className="flex flex-col gap-4">
        {LAYER_GROUPS.map((group) => {
          const allGroupChecked = group.categoryIds.every((id) =>
            activeCategories.has(id)
          );

          return (
            <div
              key={group.id}
              className="flex flex-col rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(18,28,42,0.04)] border border-[#e6eeff] gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: group.dotColor }}
                  ></span>
                  <h2 className="text-[15px] font-bold text-[#121c2a]">
                    {group.name}
                  </h2>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${group.dotColor}18`,
                      color: group.dotColor,
                    }}
                  >
                    {group.badge}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onToggleGroup(group.categoryIds);
                    onShowToast(allGroupChecked ? `ยกเลิกทั้งกลุ่ม ${group.name}` : `เลือกทั้งกลุ่ม ${group.name}`);
                  }}
                  className="text-[12px] font-bold text-[#005bbf] hover:underline cursor-pointer"
                  type="button"
                >
                  {allGroupChecked ? 'ยกเลิกทั้งกลุ่ม' : 'เลือกทั้งกลุ่ม'}
                </button>
              </div>

              <div className="flex flex-col gap-1.5 mt-1">
                {group.categoryIds.map((catId) => {
                  const cat = CATEGORIES[catId];
                  if (!cat) return null;
                  const isChecked = activeCategories.has(catId);

                  return (
                    <label
                      key={catId}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer select-none border ${
                        isChecked
                          ? 'bg-[#eff4ff] border-[#adc7ff]/60'
                          : 'bg-[#f8f9ff] border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          checked={isChecked}
                          onChange={() => onToggleCategory(catId)}
                          className="w-5 h-5 rounded accent-[#005bbf] cursor-pointer"
                          type="checkbox"
                        />
                        <div
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: cat.color }}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {cat.icon}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#121c2a]">
                            {cat.name}
                          </span>
                          <span className="text-[11px] text-[#414754]">
                            {cat.subtext}
                          </span>
                        </div>
                      </div>

                      <span className="text-[12px] font-bold text-[#414754] bg-white px-2 py-0.5 rounded-lg shadow-xs border border-[#e6eeff]">
                        {cat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Micro-card Visual Delight Map Snippet */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#dee9fc] p-4 flex flex-col justify-between shadow-xs border border-[#e6eeff]">
        <div className="flex items-center justify-between mb-2 z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005bbf] text-[20px]">
              map
            </span>
            <span className="text-[13px] font-bold text-[#121c2a]">
              มุมมองจำลองเลเยอร์หมุดซ้อน
            </span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#414754] shadow-xs">
            หมุดพร้อมเรนเดอร์
          </span>
        </div>

        {/* Spatial visual cluster preview */}
        <div className="relative h-28 w-full rounded-xl bg-[#d0dbed] flex items-center justify-center overflow-hidden">
          {activeCategories.has('restaurant') && (
            <div className="absolute top-3 left-6 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-md animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b81d17]"></span>
              <span className="text-[10px] font-bold text-[#121c2a]">
                142 ร้านอาหาร
              </span>
            </div>
          )}

          {activeCategories.has('cafe') && (
            <div className="absolute bottom-3 left-10 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
              <span className="text-[10px] font-bold text-[#121c2a]">85 คาเฟ่</span>
            </div>
          )}

          {activeCategories.has('temple') && (
            <div className="absolute top-4 right-6 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
              <span className="text-[10px] font-bold text-[#121c2a]">26 วัดไทย</span>
            </div>
          )}

          {activeCategories.has('mall') && (
            <div className="absolute bottom-3 right-8 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005bbf]"></span>
              <span className="text-[10px] font-bold text-[#121c2a]">
                19 ห้างสรรพสินค้า
              </span>
            </div>
          )}

          {/* Center radius anchor */}
          <div className="w-8 h-8 rounded-full bg-[#005bbf]/20 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-[#005bbf] shadow-lg ring-4 ring-[#005bbf]/30"></div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Floating Action Dock (Above Shell Bottom Navigation) */}
      <div className="fixed bottom-16 left-0 right-0 p-4 z-40 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/95 to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button
            onClick={() => {
              onNavigateToTab('map-view');
              onShowToast('ปรับใช้เลเยอร์และกลับสู่หน้าแผนที่แล้ว');
            }}
            className="w-full h-14 rounded-full bg-[#005bbf] hover:bg-[#1a73e8] text-white font-bold text-[15px] shadow-[0_8px_24px_-4px_rgba(26,115,232,0.45)] flex items-center justify-between px-5 active:scale-[0.98] transition-transform cursor-pointer"
            id="apply-btn"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">map</span>
              <span>
                {activeCategories.size === 0 ? 'เลือกหมวดหมู่ก่อน' : 'แสดงผลบนแผนที่'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
              <span className="text-[12px] font-extrabold text-white tracking-tight">
                {activeCategories.size} หมวด • {totalActivePins} หมุด
              </span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
