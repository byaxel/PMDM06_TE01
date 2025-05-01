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
      message: message,
      duration: 2000,
      color: "dark",
      icon: icon,
    });
    toast.present(); // Muestra el toast
  }
}
