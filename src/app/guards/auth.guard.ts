import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
// AuthGuard se encarga de proteger las rutas que requieren autenticación
export class AuthGuard implements CanActivate {
  
  // Inyección para menejar la autenticación y la navegación
  constructor(private authService: AuthService, private router: Router) {}

  // Comprueba si el usuario está autenticado
  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user) => {
        // Si está autenticado, se permite el acceso
        if (user) {
          return true;
        } else {
          // Si no está autenticado, redirige al login
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
