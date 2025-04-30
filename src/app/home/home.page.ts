import { Component } from '@angular/core';
import { MusicRecognitionService } from '../services/music-recognition.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  recognizedMusic: any;
  isRecording = false;

  constructor(private musicService: MusicRecognitionService) {}

  async recognizeSong() {
    try {
      const audioBlob = await this.captureAudio();
      const base64Audio = await this.blobToBase64(audioBlob);

      // Enviar audio base 64 a la API
      this.recognizedMusic = await this.musicService.recognizeMusic(base64Audio);

    } catch (error) {
      console.error('Error al reconocer la canción', error);
    }
  }

  // Captura audio del micrófono durante 5 segundos
  async captureAudio(): Promise<Blob> {
    this.isRecording = true;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChuncks: Blob[] = [];

    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = event => audioChuncks.push(event.data);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChuncks, { type: 'audio/wav' });
        this.isRecording = false;
        resolve(audioBlob);
      };

      mediaRecorder.start();

      // Graba durante 5 segundos y luego se detiene
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    });
  }

  // Convierte un Blob a Base64 para enviar por HTTP
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;

        // Elimina el encabezado "data:audio/wav;base64," si es necesario
        resolve(base64data.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

}
