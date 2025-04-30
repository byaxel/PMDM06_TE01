import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  // Método para mostrar un toast
  async showToast(message: string, icon: string) {
    const toast = await this.toastController.create({
      message: message, // El mensaje del toast
      duration: 2000,   // Duración del toast en milisegundos
      color: "dark",    // Color del fondo del toast
      icon: icon,       // Icono del toast
    });
    toast.present(); // Muestra el toast
  }
}
