import { Component } from '@angular/core';
import { MusicRecognitionService } from '../services/music-recognition.service';
import { SimpleMusicData } from '../interfaces/simple-music-data';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  // Variable para almacenar la música reconocida
  recognizedMusic: SimpleMusicData | null = null;
  

  // Variable para manejar el estado de grabación
  isListening = false;

  // Nuestro servicio de reconocmiento de música
  constructor(
    private musicService: MusicRecognitionService,
    private toastService: ToastService
  ) {}

  // Método principal para reconocer la canción
  async recognizeSong() {

    // Indica que empieza escuchar
    this.isListening = true;

    // Limpiamos la canción reconocida anterior
    this.recognizedMusic = null;

    try {
      // Capturamos el audio desde el micrófono
      const audioBase64 = await this.captureAudio();
      console.log('Audio capturado. Enviando a la API...');

      // Enviamos el audio a la API para su reconocimiento
      this.musicService.recognizeMusic(audioBase64).subscribe({
        next: (result) => {
          // Cuando recibimos la respuesta, la asignamos a recognizedMusic
          this.recognizedMusic = result;

          // Mostramos los resultados en consola
          if (this.recognizedMusic) {
            console.log('Canción reconocida:', JSON.stringify(this.recognizedMusic));
            
          } else {
            console.warn('No se reconoció ninguna canción.');
            this.toastService.showToast('No se reconoció ninguna canción.', 'alert');
          }
          this.isListening = false;
        },
        error: (error) => {
          // Manejo de errores en la llamada a la API
          console.error('Error al reconocer la canción:', error.message || error);
          this.isListening = false;
        }
      });

    } catch (error) {
      // Manejamos cualquier error que ocurra al intentar capturar o reconocer la canción
      if (error instanceof Error) {
        console.error('Error al reconocer la canción:', error.message);
      } else {
        console.error('Error al reconocer la canción (sin Error):', JSON.stringify(error));
      }
    }
  }

  // Método para capturar audio del micrófono durante 10 segundos
  async captureAudio(): Promise<string> {
    try {
      // Verifica si la aplicación tiene permisos para grabar audio
      const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();

      // Si no se tiene permisos, pide el permiso al usuario
      if (!hasPermission.value) {
        const permissionRequest = await VoiceRecorder.requestAudioRecordingPermission();
        if (!permissionRequest) {
          throw new Error('No se tiene permiso para grabar audio');
        }
      }

      // Inicia la grabación
      await VoiceRecorder.startRecording();
      console.log('Grabación iniciada.');

      // Espera 10 segundos para grabar
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Detiene la grabación
      const result = (await VoiceRecorder.stopRecording()).value;
      console.log("Grabación detenida: ", JSON.stringify(result));

      // Verifica si los datos de audio en base64 están disponibles en el resultado
      if (!result.recordDataBase64) {
        throw new Error('No se pudo capturar el audio en base64');
      }

      // Devuelve el audio capturado en formato Base64
      return result.recordDataBase64;
    } catch (error) {
      // Si ocurre un error durante la grabación
      console.log('Error al grabar audio: ' + error);
      throw error;
    }
  }
}
