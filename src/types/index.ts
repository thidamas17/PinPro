export type CategoryId = 
  | 'restaurant' 
  | 'cafe' 
  | 'streetfood' 
  | 'bar' 
  | 'temple' 
  | 'mosque' 
  | 'church' 
  | 'museum' 
  | 'mall' 
  | 'supermarket' 
  | 'market' 
  | 'park' 
  | 'hotel';

export type GroupId = 'food' | 'culture' | 'shopping' | 'nature';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  subtext: string;
  groupId: GroupId;
  icon: string;
  color: string;
  bgColor: string;
  count: number;
}

export interface LayerGroup {
  id: GroupId;
  name: string;
  badge: string;
  dotColor: string;
  categoryIds: CategoryId[];
}

export interface Place {
  id: string;
  name: string;
  categoryId: CategoryId;
  categoryLabel: string;
  categoryIcon: string;
  badgeLabel?: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  displayDistance: string;
  openStatus: string;
  isOpen: boolean;
  closingTime?: string;
  district: string;
  address: string;
  phone?: string;
  description?: string;
  etiquette?: string;
  imageUrl: string;
  mapX: number; // percentage on map (0-100)
  mapY: number; // percentage on map (0-100)
  isPopular?: boolean;
  nearbyWalkingRecommendations?: {
    type: 'cafe' | 'food' | 'mall' | 'culture';
    label: string;
    distance: string;
    count: number;
  }[];
  nearbyPlaces?: string[]; // IDs of nearby places for radar
}

export type ViewTab = 'map-view' | 'category-layers' | 'places-list' | 'saved-places' | 'place-details';

export type SortMode = 'distance' | 'rating' | 'popularity';

export interface LocationHub {
  id: string;
  name: string;
  province: string;
  coordinates: { lat: number; lng: number };
}
