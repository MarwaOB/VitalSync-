import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    // Get the required roles from the route data
    const requiredRoles = next.data['roles'] as Array<string>;

    // Check if the user is authenticated and has the required role
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (user && requiredRoles.includes(user.role)) {
          return true; // User is authorized
        } else {
          this.router.navigate(['/login']); // Redirect to login or any other page
          return false;
        }
      })
    );
  }
}
