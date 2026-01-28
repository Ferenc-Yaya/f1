import { Injectable } from '@angular/core';

export interface User {
  username: string;
  cargo: string;
  sede: string;
}

const MOCK_USERS = [
  { username: 'alfredo', password: 'alfredo123', cargo: 'Administrador de Contrato', sede: 'Cerro del Aguila' },
  { username: 'pedro', password: 'pedro123', cargo: 'Seguridad', sede: 'Cerro del Aguila' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  login(username: string, password: string): boolean {
    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      this.currentUser = {
        username: found.username,
        cargo: found.cargo,
        sede: found.sede,
      };
      return true;
    }
    return false;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }
}
