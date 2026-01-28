import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit() {
    if (this.auth.login(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      this.error = 'Usuario o contrasena incorrectos';
    }
  }
}
