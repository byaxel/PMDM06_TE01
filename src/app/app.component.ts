import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Esperamos un tiempo fijo (por ejemplo, 2 segundos) para que Firebase resuelva el estado
    setTimeout(() => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          console.log('Usuario logueado: ', user.email);
          this.router.navigate(['/home']);
        } else {
          console.log('Usuario no logueado.');
          this.router.navigate(['/login']);
        }

        // Al finalizar, dejamos de mostrar el loading
        this.isLoading = false;
      });
    }, 1000); // Tiempo de espera de 2 segundos
  }

}
