import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;
export const ZOOM = 14;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
  div {
    width: 100vw;
    height: calc(100vh - 64px);
    background-color: red;
  }

  #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }

  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  zoom = signal(ZOOM);
  coordinates = signal({
    lng: -5.984659729659308,
    lat: 37.42436645422043,
  });

  // Se disparará cada vez que cambie el valor de una señal
  // dentro de la función, en este caso, zoom
  zoomEffect = effect(() => {
    if (!this.map()) return;

    this.map()?.setZoom(this.zoom());
    // this.map()?.zoomTo(this.zoom());
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

    this._mapListeners(map);
  }

  private _mapListeners(map: mapboxgl.Map) {
    // Evento que se dispara después de que acabe el zoom
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    // Evento que ocurre cuando el mapa deja de moverse
    map.on('moveend', () => {
      this.coordinates.set(map.getCenter());
    });

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());

    // De esta forma, nuestra señal de zoom cambia de valor
    // si cambiamos el zoom manualmente mediante la rueda
    // del mouse.
    this.map.set(map);
  }
}
