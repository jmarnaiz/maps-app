import {
  Component,
  input,
  ElementRef,
  signal,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import type { LngLatProperty } from '../../../models/house-property.model';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = input<number>(14);

  coordinates = input.required<LngLatProperty>();

  ngAfterViewInit(): void {
    const element = this.divElement()?.nativeElement;
    if (!element) return;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.coordinates(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      interactive: false,
      pitch: 36,
    });

    new mapboxgl.Marker().setLngLat(this.coordinates()).addTo(map);
  }
}
