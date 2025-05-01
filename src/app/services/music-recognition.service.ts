import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Options, SimpleMusicData } from '../interfaces/simple-music-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError, of } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MusicRecognitionService {

  // https://cors-anywhere.herokuapp.com/corsdemo
  
  // Configuración predeterminada de la API
  defaultOptions: Options = {
    host: `https://cors-anywhere.herokuapp.com/https://${environment.acrConfig.host}`,
    endpoint: '/v1/identify',
    signature_version: '1',
    data_type:'audio',
    secure: true,
    access_key: environment.acrConfig.accessKey,
    access_secret: environment.acrConfig.accessSecret
  };

  // Inyección del servicio para realizar solicitudes HTTP
  constructor(private http: HttpClient) { }

  // Método para reconocer música
  // Recibe el audio en base64 y lo envía a la API
  recognizeMusic(audioBase64: string): Observable<SimpleMusicData> {

    // Limpiamos el base64 del audio
    const cleanBase64 = audioBase64.split(',')[1] || audioBase64;

    // Convertimos el base64 en un Blob para enviarlo como archivo
    const audioBlob = this.base64ToBlob(cleanBase64, 'audio/wav');

    // Creamos el objeto FormData que enviaremos en la solicitud
    const formData = new FormData();
    const httpMethod = 'POST';
    const httpURI = this.defaultOptions.endpoint;
    const dataType = this.defaultOptions.data_type;
    const signatureVersion = this.defaultOptions.signature_version;
    const timestamp = Math.floor(Date.now() / 1000);

    // Extraemos las claves de la configuración predeterminada
    const { access_key, access_secret } = this.defaultOptions;

    // Cadena para firmar
    const stringToSign = [
      httpMethod,
      httpURI,
      access_key,
      dataType,
      signatureVersion,
      timestamp
    ].join('\n');

    // Generamos la firma HMAC-SHA1 con el secreto de acceso, codificada en Base64
    const signature = CryptoJS.HmacSHA1(stringToSign, access_secret).toString(CryptoJS.enc.Base64);

    // Añadimos los datos al FormData
    formData.append('sample', audioBlob, 'recording.wav');
    formData.append('sample_bytes', audioBlob.size.toString());
    formData.append('access_key', access_key);
    formData.append('data_type', dataType);
    formData.append('signature_version', signatureVersion);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());

    // Construimos la URL completa para hacer la solicitud
    const apiUrl = `${this.defaultOptions.host}${httpURI}`;

    // Realizamos la solicitud HTTP POST para enviar los datos a la API
    return this.http.post(apiUrl, formData).pipe(
      switchMap((response: any) => {
        const music = this.parseMusicData(response);
        console.log('Respuesta de la API:', response);

        // Si no se encuentra el ID de Deezer, devolvemos los datos sin portada personalizada
        if (!music || !music.deezerId) {
          return of(music as SimpleMusicData);
        }

        // Obtenemos la portada del álbum desde Deezer y la añadimos al objeto de música
        return this.getDeezerCoverUrl(music.deezerId).pipe(
          map(converUrl => {
            return {
              ...music,
              albumCoverUrl: converUrl
            };
          })
        );
      }),

      // Si ocurre un error, lo capturamos y lo manejamos
      catchError(error => {
        console.error('Error en la solicitud de reconocimiento de música', error);
        return throwError(() => new Error('Error en la solicitud a la API de reconocimiento'));
      })
    );
  }

  // Transforma la respuesta de la API en un objeto con los datos de la música
  private parseMusicData(apiResponse: any): SimpleMusicData | null {

    // Extraemos la primera canción de la respuesta
    const music = apiResponse?.metadata?.music?.[0];

    if (!music) {
      console.log('No se encontró música en la respuesta');
      return null;
    }

    // Si se encuentra música, retornamos un objeto con los datos que nos interesan
    return {
      title: music.title,
      artist: music.artists?.[0]?.name || 'Unknown',
      album: music.album?.name || 'Unknown',
      albumCoverUrl: 'https://iili.io/HlHy9Yx.png',
      spotifyTrackId: music.external_metadata?.spotify?.track?.id || '',
      youtubeVideoLink: music.external_metadata?.youtube?.vid
      ? `https://www.youtube.com/watch?v=${music.external_metadata.youtube.vid}`
      : '',
      deezerId: music.external_metadata?.deezer?.track?.id || '',
    }
  }

  // Obtiene la URL de la portada desde Deezer usando su ID
  private getDeezerCoverUrl(deezerId: string): Observable<string> {
    const url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/${deezerId}`;

    return this.http.get<any>(url).pipe(
      map(res => 
        res.album?.cover_xl ||
        res.album?.cover_big ||
        res.album?.cover_medium ||
        res.album?.cover ||
        'https://iili.io/HlHy9Yx.png'
      ),
      // Si ocurre un error, devolvemos una portada genérica por defecto
      catchError(err => {
        console.error('Error al obtener la portada de Deezer:', err);
        return new Observable<string>(observer => {
          observer.next('https://iili.io/HlHy9Yx.png');
          observer.complete();
        });
      })
    );
  }


  // Convierte una cadena base64 en un Blob
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
  
    // Recorremos cada carácter y lo convertimos a su valor numérico en ASCII
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
  
    // Creamos un Uint8Array con los datos binarios
    const byteArray = new Uint8Array(byteNumbers);

    // Retornamos un Blob con el tipo MIME especificado
    return new Blob([byteArray], { type: mimeType });
  }
}
