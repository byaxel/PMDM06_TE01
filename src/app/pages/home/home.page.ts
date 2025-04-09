
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  // Variable para almacenar el nombre del usuario
  public name: String = "";

  // Variable para almacenar el texto que se quiere convertir en voz
  textToRead: string = '';

  // Inyección de dependencias para AuthService y Router
  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  // Llamamos a la función para obtener el nombre del usuario
  ngOnInit() {
    this.getName();
  }

  // Método que obtiene el nombre del usuario
  getName() {

    // Obtiene el usuario actual desde el servicio
    const user = this.authService.getCurrenUserSnapshot();

    if (user && user.displayName) {
      
      // Tomamos la primera palabra (excluimos los apellidos)
      this.name = user.displayName.split(' ')[0]; // Tomamos solo la primera palabra
    
    } else {

      // Si no hay nombre disponible
      this.name = 'User';
    }
  }

  // Método para hacer logoutgin
  async logout() {
    this.authService.logout()
    this.toastService.showToast('Has cerrado sesión.', 'close-outline');
  }

  // Método para convertir el texto en audio
  async speak() {
    if (this.textToRead.trim() === '') {
      return;
    }

    await TextToSpeech.speak( {
      text: this.textToRead,
      lang: 'es-ES',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    })
  }
}
