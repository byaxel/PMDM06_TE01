import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class MusicRecognitionService {

  private apiUrl = 'https://api.acrcloud.com/v1/identify';
  private apiKey = 'API_KEY';

  constructor() { }

  // Método para reconocer música
  async recognizeMusic(audioData: any) {
    try {
      const response = await axios.post(this.apiUrl, audioData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error reconociendo la música', error);
      throw error;
    }
  }
}
