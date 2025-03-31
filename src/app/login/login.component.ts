import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  fg?: FormGroup;
  constructor(
    private appComponent: AppComponent,
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fg = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });

    if (this.storageService.autenticado()) {
      this.router.navigate(['/']);
    }
  }

  autenticar(): void {
    const valorUsuario: string = this.fg?.get('usuario')?.value!;
    const valorPassword: string = this.fg?.get('password')?.value!;

    this.authService.login(valorUsuario, valorPassword).subscribe({
      next: (respuesta) => {
        this.storageService.guardar(respuesta);
        const userRoles = this.storageService.tipoUsuario();
        if (userRoles.length > 0) {
          
          this.router.navigate(['/administracion/inicio']).then(() => {
            history.pushState(null, '', location.href);
            window.location.reload();
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No tienes los permisos necesarios para ingresar al sistema',
          });
          this.appComponent.logout(); // Llamar al método de cierre de sesión
          this.router.navigate(['/login']); // Redirigir a la página de inicio de sesión
        }
      },
      error: (dataerror) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Falló la autenticación',
        }),
    });
  }

  validarCorreoElectronico() {
    const correo = this.fg?.get('usuario')?.value!;
    if (correo != null && correo.trim() !== '') {
      const validarCorreo = this.fg
        ?.get('usuario')
        ?.value!.includes('@uniquindio.edu.co');
      if (!validarCorreo) {
        return true;
      } else {
        return false;
      }
    }
    return null;
  }

}
