export interface HouseProperty {
  id: string;
  name: string;
  description: string;
  price: number;
  lngLat: LngLatProperty;
  tags: string[];
}

export interface LngLatProperty {
  lng: number;
  lat: number;
}
