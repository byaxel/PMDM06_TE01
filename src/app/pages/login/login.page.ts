import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  name: String = 'User'

  // Inyección de dependencias para AuthService y Router
  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
  }

  // Método para inciar sesión con Google
  async loginWithGoogle() {
    await this.handleLogin(this.authService.loginWithGoogle.bind(this.authService), 'Google');
  }

  // Método para iniciar sesión con GitHub
  async loginWithGithub() {
    await this.handleLogin(this.authService.loginWithGithub.bind(this.authService), 'GitHub');
  }

  // Método genérico para gestionar logins con diferentes proveedores
  // @param loginMethod - Función que ejecuta el login (Google o GitHub)
  // @param provider - Nombre del proveedor para el mensaje del toast
  private async handleLogin(loginMethod: () => Promise<boolean>, provider: string) {

    // Intenta iniciar sesión con el proveedor mediante el servicio AuthService que recibe
    // Si el login es exitoso, el AuthGuard redirige al usuario a la página de inicio
    const success = await loginMethod();

    // Si el login es exitoso, obtenemos el nombre y damos la bienvenida en un toast
    if (success) {
      this.name = this.authService.getCurrenUserSnapshot()?.displayName || 'User';
      this.toastService.showToast(`¡Bienvenido, ${this.name}!`, 'checkmark-outline');
    } else {
      // Informamos en un toast si hubo algún error
      this.toastService.showToast(`No se pudo iniciar sesión con ${provider}`, 'alert-outline');
    }
  }
  
}
