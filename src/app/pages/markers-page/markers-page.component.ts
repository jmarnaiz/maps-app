import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { v4 } from 'uuid';

mapboxgl.accessToken = environment.mapboxKey;
export const ZOOM = 14;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);
  zoom = signal(ZOOM);
  coordinates = signal({
    lng: -5.984659729659308,
    lat: 37.42436645422043,
  });
  ngAfterViewInit(): void {
    const element = this.divElement()?.nativeElement;
    const { lat, lng } = this.coordinates();
    if (!element) return;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    // marker.on('dragend', (event) => {
    //   console.log('Event: ', event);
    // });
    this._mapListeners(map);
  }

  private _mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => {
      this.mapClick(event, map);
    });
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent, map: mapboxgl.Map) {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const marker = new mapboxgl.Marker({ draggable: false, color })
      .setLngLat(event.lngLat)
      .addTo(map);

    const newMarker: Marker = { id: v4(), mapboxMarker: marker };

    this.markers.update((currentMarkers) => [newMarker, ...currentMarkers]);
  }

  flyToMarker(lngLat: LngLatLike) {
    this.map()?.flyTo({ center: lngLat });
  }

  deleteMarker(marker: Marker) {
    this.markers.update((currentMarkers) => [
      ...currentMarkers.filter((m) => m.id != marker.id),
    ]);
    marker.mapboxMarker.remove();
  }

  getFormattedCoordinates(marker: Marker): string {
    const { lat, lng } = marker.mapboxMarker.getLngLat();
    return `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
  }
}
