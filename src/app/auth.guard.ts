import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { StorageService } from './services/storage.service';

export const authMatch: CanMatchFn = (route, segments) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const requiredRoles = (route.data?.['roles'] as string[]) || []; // Aseguramos que sea un array
  let roleMatch = false;

  if (storageService.autenticado()) {
    const userRoles = storageService.tipoUsuario();
    if (requiredRoles.length > 0 && userRoles.length > 0) {
      roleMatch = userRoles.some(userRole => requiredRoles.includes(userRole));
    }
    if (roleMatch || requiredRoles.length === 0) { // Permitir acceso si no se requieren roles
      return true;
    } else {
      return router.parseUrl('/unauthorized');
    }
  } else {
    return router.parseUrl('/login');
  }
};