
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Auth, getAuth, setPersistence, browserSessionPersistence, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, User, AuthProvider, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Instancia de Auth para Firebase
  private auth: Auth;

  // Observador de usuario actual, inicializado en null
  private currentUser$ = new BehaviorSubject<User | null>(null);

  // Inyecta el controlador para los toats
  constructor() {

    // Inicializa Firebase con la configuración del environment
    let app = initializeApp(environment.firebaseConfig);

    // Instancia de autenticación de Firebase
    this.auth = getAuth(app)

   // Establecer persistencia para la sesión
   setPersistence(this.auth, browserSessionPersistence)  // Usar persistencia local
   .then(() => {
     // Escuchar los cambios de autenticación
     onAuthStateChanged(this.auth, (user) => {
       this.currentUser$.next(user); // Actualizar el usuario
     });
   })
   .catch((error) => {
     console.error("Error al establecer persistencia: ", error);
   });
  }

  // Login con Google
  loginWithGoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();

    // Fuerza a Googe a pedir al usuario que seleccione su cuenta
    provider.setCustomParameters({
      prompt: 'select_account'
    });
  
    // Llama al método base con el proveedor de Google
    return this.loginWithProvider(provider);
  }

  // Login con GitHub
  loginWithGithub(): Promise<boolean> {

    // Llama al método base con el proveedor de GitHub
    return this.loginWithProvider(new GithubAuthProvider())
  }

  // Login base hacer login con un proveedor (Google o GitHub)
  private async loginWithProvider(provider: AuthProvider): Promise<boolean> {
    try {
      // Inicia sesión con el proveedor (Google o GitHub)
      const result = await signInWithPopup(this.auth, provider)
      console.log('User signed in: ', result.user)

      // Actualiza el estado con el nuevo usuario
      this.currentUser$.next(result.user);
      return true

    } catch (error) {
      // Manejo de errores
      console.error('Error signing in: ', error)
      this.currentUser$.next(null);
      return false
    }
  }

  // Método de logout
  async logout(): Promise<void> {

    // Cierra sesión de Firebase
    await this.auth.signOut();

    // Limpia el estado del usuario
    this.currentUser$.next(null);
  }

  // Devuelve un observable del usuario actual
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  // Devuelve el usuario actual directamente desde Firebase Auth
  getCurrenUserSnapshot(): User | null {
    return this.auth.currentUser;
  }

}

