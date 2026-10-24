/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Place, CategoryId, ViewTab, LocationHub } from './types';
import { PLACES, LOCATION_HUBS, RADIUS_PRESETS } from './data/placesData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { NavigationModal } from './components/NavigationModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { TripPlanModal } from './components/TripPlanModal';
import { MapView } from './views/MapView';
import { PlaceDetailsView } from './views/PlaceDetailsView';
import { PlacesListView } from './views/PlacesListView';
import { CategoryLayersView } from './views/CategoryLayersView';
import { SavedPlacesView } from './views/SavedPlacesView';

export default function App() {
  // Navigation states
  const [currentTab, setCurrentTab] = useState<ViewTab>('map-view');
  const [previousTab, setPreviousTab] = useState<ViewTab>('map-view');

  // Selected place for map bottom sheet & details
  const [mapSelectedPlace, setMapSelectedPlace] = useState<Place>(
    PLACES.find((p) => p.id === 'wat-pathum') || PLACES[1]
  );
  const [detailsPlace, setDetailsPlace] = useState<Place>(
    PLACES.find((p) => p.id === 'wat-khaek') || PLACES[0]
  );

  // Active Category Filters (Defaults matching 4 active in mockups: restaurant, cafe, temple, mall)
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(['restaurant', 'cafe', 'temple', 'mall'])
  );

  // Radius selection (1 to 5 steps, 3 = 20 km default)
  const [radiusStep, setRadiusStep] = useState<number>(3);
  const radiusKm = [5, 10, 20, 35, 50][radiusStep - 1] || 20;

  // Filter toggles
  const [filterOpenNow, setFilterOpenNow] = useState<boolean>(true);
  const [filterRating4Plus, setFilterRating4Plus] = useState<boolean>(true);

  // Reference Location Hub
  const [currentLocationHub, setCurrentLocationHub] = useState<LocationHub>(LOCATION_HUBS[0]);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);

  // Bookmarks
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(
    new Set(['wat-khaek', 'factory-coffee', 'jeh-o'])
  );

  // Trip Itineraries
  const [tripPlaceIds, setTripPlaceIds] = useState<Set<string>>(
    new Set(['wat-khaek', 'luka-cafe', 'prachak-duck'])
  );
  const [savedTrips, setSavedTrips] = useState<
    { id: string; name: string; placeIds: string[]; date: string }[]
  >([
    {
      id: 'trip-1',
      name: 'ทริปสายมู & คาเฟ่ฮอปปิ้ง สีลม',
      placeIds: ['wat-khaek', 'luka-cafe', 'prachak-duck', 'silom-complex'],
      date: 'วันนี้',
    },
  ]);

  // Modals state
  const [navigationTargetPlace, setNavigationTargetPlace] = useState<Place | null>(null);
  const [isTripModalOpen, setIsTripModalOpen] = useState<boolean>(false);

  // Custom added places (e.g. from Google Maps live search)
  const [customPlaces, setCustomPlaces] = useState<Place[]>([]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Adjust distances slightly if location hub changes
  const adjustedPlaces = useMemo(() => {
    const combinedPlaces = [...customPlaces, ...PLACES];
    return combinedPlaces.map((p) => {
      // Calculate adjusted distance based on hub
      let multiplier = 1;
      if (currentLocationHub.id === 'silom') {
        if (p.district.includes('สีลม') || p.district.includes('บางรัก')) multiplier = 0.3;
        else multiplier = 1.4;
      } else if (currentLocationHub.id === 'sukhumvit') {
        multiplier = 1.2;
      }
      const dist = parseFloat((p.distanceKm * multiplier).toFixed(1));
      return {
        ...p,
        distanceKm: dist,
        displayDistance: dist < 1 ? `${Math.round(dist * 1000)} ม.` : `${dist} กม.`,
      };
    });
  }, [currentLocationHub, customPlaces]);

  const handleAddCustomPlace = (newPlace: Place) => {
    setCustomPlaces((prev) => [newPlace, ...prev.filter((p) => p.id !== newPlace.id)]);
    setActiveCategories((prev) => new Set([...prev, newPlace.categoryId]));
    setMapSelectedPlace(newPlace);
  };

  // Category toggle handlers
  const handleToggleCategory = (catId: CategoryId) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    const all: CategoryId[] = [
      'restaurant',
      'cafe',
      'streetfood',
      'bar',
      'temple',
      'mosque',
      'church',
      'museum',
      'mall',
      'supermarket',
      'market',
      'park',
      'hotel',
    ];
    setActiveCategories(new Set(all));
  };

  const handleClearAllCategories = () => {
    setActiveCategories(new Set());
  };

  const handleResetDefaultCategories = () => {
    setActiveCategories(new Set(['restaurant', 'cafe', 'temple', 'mall']));
    setRadiusStep(3);
    setFilterOpenNow(true);
    setFilterRating4Plus(true);
  };

  const handleToggleGroup = (categoryIds: CategoryId[]) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      const allPresent = categoryIds.every((id) => next.has(id));
      if (allPresent) {
        categoryIds.forEach((id) => next.delete(id));
      } else {
        categoryIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Radius stepper cycle in MapView
  const handleCycleRadius = () => {
    setRadiusStep((prev) => {
      const next = prev >= 5 ? 1 : prev + 1;
      showToast(`ปรับรัศมีเป็น ${RADIUS_PRESETS[next]?.text}`);
      return next;
    });
  };

  // Bookmark toggle
  const handleToggleBookmark = (placeId: string) => {
    setSavedPlaceIds((prev) => {
      const next = new Set(prev);
      const place = adjustedPlaces.find((p) => p.id === placeId);
      const name = place ? place.name : 'สถานที่';
      if (next.has(placeId)) {
        next.delete(placeId);
        showToast(`ลบ "${name}" ออกจากรายการบันทึกแล้ว`);
      } else {
        next.add(placeId);
        showToast(`บันทึก "${name}" เรียบร้อยแล้ว ⭐`);
      }
      return next;
    });
  };

  // Trip item toggle
  const handleToggleTripItem = (placeId: string) => {
    setTripPlaceIds((prev) => {
      const next = new Set(prev);
      const place = adjustedPlaces.find((p) => p.id === placeId);
      const name = place ? place.name : 'สถานที่';
      if (next.has(placeId)) {
        next.delete(placeId);
        showToast(`นำ "${name}" ออกจากเส้นทางทริปแล้ว`);
      } else {
        next.add(placeId);
        showToast(`เพิ่ม "${name}" ลงในเส้นทางท่องเที่ยวแล้ว ✨`);
      }
      return next;
    });
  };

  // Navigation handlers
  const handleNavigateToDetails = (place: Place) => {
    setPreviousTab(currentTab);
    setDetailsPlace(place);
    setCurrentTab('place-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlaceForMap = (place: Place) => {
    setMapSelectedPlace(place);
    setCurrentTab('map-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`ดูหมุด "${place.name}" บนแผนที่`);
  };

  const handleSaveCustomTrip = (tripName: string, placeIds: string[]) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      name: tripName,
      placeIds,
      date: 'บันทึกใหม่',
    };
    setSavedTrips((prev) => [newTrip, ...prev]);
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Universal Fixed Header with Global Search */}
      <Header
        currentTab={currentTab}
        onBack={() => {
          setCurrentTab(previousTab === 'place-details' ? 'map-view' : previousTab);
        }}
        locationName={`${currentLocationHub.name}, ${currentLocationHub.province}`}
        radiusKm={radiusKm}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        savedCount={savedPlaceIds.size}
        places={adjustedPlaces}
        onSelectPlaceForDetails={handleNavigateToDetails}
        onSelectPlaceForMap={handleSelectPlaceForMap}
      />

      {/* Main Screen Views */}
      <main className="flex-1 w-full flex flex-col">
        {currentTab === 'map-view' && (
          <MapView
            places={adjustedPlaces}
            selectedPlace={mapSelectedPlace}
            onSelectPlace={(p) => setMapSelectedPlace(p)}
            activeCategories={activeCategories}
            onToggleCategory={handleToggleCategory}
            onResetCategories={handleResetDefaultCategories}
            radiusKm={radiusKm}
            onCycleRadius={handleCycleRadius}
            savedPlaceIds={savedPlaceIds}
            onToggleBookmark={handleToggleBookmark}
            onNavigateToDetails={handleNavigateToDetails}
            onStartNavigation={(p) => setNavigationTargetPlace(p)}
            onNavigateToTab={(tab) => {
              setPreviousTab('map-view');
              setCurrentTab(tab);
            }}
            locationName={currentLocationHub.name}
            onShowToast={showToast}
            onAddCustomPlace={handleAddCustomPlace}
          />
        )}

        {currentTab === 'place-details' && (
          <PlaceDetailsView
            place={detailsPlace}
            allPlaces={adjustedPlaces}
            onBack={() => {
              setCurrentTab(previousTab === 'place-details' ? 'map-view' : previousTab);
            }}
            savedPlaceIds={savedPlaceIds}
            onToggleBookmark={handleToggleBookmark}
            tripPlaceIds={tripPlaceIds}
            onToggleTripItem={handleToggleTripItem}
            onStartNavigation={(p) => setNavigationTargetPlace(p)}
            onOpenTripModal={() => setIsTripModalOpen(true)}
            onShowToast={showToast}
            onSelectNearbyPlace={(p) => handleNavigateToDetails(p)}
          />
        )}

        {currentTab === 'places-list' && (
          <PlacesListView
            places={adjustedPlaces}
            activeCategories={activeCategories}
            radiusKm={radiusKm}
            savedPlaceIds={savedPlaceIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectPlaceForMap={handleSelectPlaceForMap}
            onSelectPlaceForDetails={handleNavigateToDetails}
            onStartNavigation={(p) => setNavigationTargetPlace(p)}
            onNavigateToTab={(tab) => {
              setPreviousTab('places-list');
              setCurrentTab(tab);
            }}
            locationName={currentLocationHub.name}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'category-layers' && (
          <CategoryLayersView
            activeCategories={activeCategories}
            onToggleCategory={handleToggleCategory}
            onSelectAll={handleSelectAllCategories}
            onClearAll={handleClearAllCategories}
            onResetDefaults={handleResetDefaultCategories}
            onToggleGroup={handleToggleGroup}
            radiusStep={radiusStep}
            onSetRadiusStep={(step) => setRadiusStep(step)}
            filterOpenNow={filterOpenNow}
            onToggleOpenNow={() => setFilterOpenNow(!filterOpenNow)}
            filterRating4Plus={filterRating4Plus}
            onToggleRating4Plus={() => setFilterRating4Plus(!filterRating4Plus)}
            onNavigateToTab={(tab) => {
              setPreviousTab('category-layers');
              setCurrentTab(tab);
            }}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'saved-places' && (
          <SavedPlacesView
            places={adjustedPlaces}
            savedPlaceIds={savedPlaceIds}
            onToggleBookmark={handleToggleBookmark}
            savedTrips={savedTrips}
            onSelectPlaceForDetails={handleNavigateToDetails}
            onSelectPlaceForMap={handleSelectPlaceForMap}
            onStartNavigation={(p) => setNavigationTargetPlace(p)}
            onNavigateToTab={(tab) => {
              setPreviousTab('saved-places');
              setCurrentTab(tab);
            }}
            onDeleteTrip={handleDeleteTrip}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation (visible on map-view, category-layers, places-list, saved-places) */}
      {currentTab !== 'place-details' && (
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => {
            setPreviousTab(currentTab);
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeCategoriesCount={activeCategories.size}
          savedCount={savedPlaceIds.size}
        />
      )}

      {/* Interactive Turn-by-Turn GPS Navigation Modal */}
      {navigationTargetPlace && (
        <NavigationModal
          place={navigationTargetPlace}
          originName={`${currentLocationHub.name}, ${currentLocationHub.province}`}
          onClose={() => setNavigationTargetPlace(null)}
          onShowToast={showToast}
        />
      )}

      {/* Location Picker Hub Modal */}
      {isLocationPickerOpen && (
        <LocationPickerModal
          currentHub={currentLocationHub}
          onSelectHub={(hub) => {
            setCurrentLocationHub(hub);
            showToast(`เปลี่ยนศูนย์กลางเป็น "${hub.name}"`);
          }}
          onClose={() => setIsLocationPickerOpen(false)}
          radiusKm={radiusKm}
        />
      )}

      {/* Trip Excursion Tour Planner Modal */}
      {isTripModalOpen && (
        <TripPlanModal
          anchorPlace={detailsPlace}
          nearbyPlaces={adjustedPlaces.filter((p) =>
            (detailsPlace.nearbyPlaces || []).includes(p.id)
          )}
          onClose={() => setIsTripModalOpen(false)}
          onSaveTrip={handleSaveCustomTrip}
          onNavigatePlace={(p) => setNavigationTargetPlace(p)}
          onShowToast={showToast}
        />
      )}

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
