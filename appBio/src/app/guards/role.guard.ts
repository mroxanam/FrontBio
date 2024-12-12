import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiredRoles = route.data['roles'] as string[];
        const userInfo = this.authService.getUserInfo();
        
        console.log('RoleGuard - URL solicitada:', state.url);
        console.log('RoleGuard - Roles requeridos:', requiredRoles);
        console.log('RoleGuard - Info del usuario:', userInfo);
        console.log('RoleGuard - Rol del usuario:', userInfo.rol);

        // Si no hay información del usuario, redirigir al login
        if (!userInfo || !userInfo.rol) {
            console.log('RoleGuard - No hay información de usuario, redirigiendo a login');
            this.router.navigate(['/login']);
            return false;
        }

        // Verificar si el rol del usuario está en los roles permitidos
        const hasPermission = requiredRoles.includes(userInfo.rol);
        console.log('RoleGuard - ¿Tiene permiso?:', hasPermission);

        if (!hasPermission) {
            console.log('RoleGuard - Acceso denegado, redirigiendo a unauthorized');
            this.router.navigate(['/unauthorized']);
            return false;
        }

        console.log('RoleGuard - Acceso permitido');
        return true;
    }
}
