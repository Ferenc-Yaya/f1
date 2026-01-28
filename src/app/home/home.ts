import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { RegistroService, Registro } from '../services/registro.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  user: User | null = null;
  registros: Registro[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private registroService: RegistroService
  ) {
    this.user = this.auth.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.registros = this.registroService.getAll();
  }

  agregarF1() {
    this.router.navigate(['/registro']);
  }

  editar(reg: Registro) {
    this.router.navigate(['/registro', reg.id]);
  }

  eliminar(id: number) {
    this.registroService.delete(id);
    this.registros = this.registroService.getAll();
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
