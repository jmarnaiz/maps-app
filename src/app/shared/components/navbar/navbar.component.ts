import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  routes = routes
    .map(({ path, title }) => ({
      path,
      title,
    }))
    .filter((route) => route.title);

  _router = inject(Router);
  // routes = routes
  //   .map((route) => ({
  //     path: route.path,
  //     title: route.title,
  //     // title: `${route.title ?? 'Maps in Angular'}`,
  //     // title: route.title ?? 'Maps in Angular',
  //     // Lo hago para que el tipado de routes sea más amigable
  //   }))
  //   .filter((route) => route.title);

  // pageTitle$ = this._router.events.pipe(
  //   filter((event) => event instanceof NavigationEnd),
  //   // tap((event) => console.log('Event: ', event)),
  //   map((event) => event.url),
  //   map((url) => routes.find((route) => `/${route.path}` === url)?.title)
  // );

  // Para convertirlo en señal
  pageTitle = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      // tap((event) => console.log('Event: ', event)),
      map((event) => event.url),
      map((url) => routes.find((route) => `/${route.path}` === url)?.title)
    )
  );
}
