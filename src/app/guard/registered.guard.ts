import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { AppService } from '../../app/app.service'

@Injectable({
  providedIn: 'root',
})
export class RegisteredGuard implements CanActivate {
  constructor(private app: AppService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const authState = this.app.authState.value
    const path = route.url[0].path
    if (path !== 'login' && (authState === 'unauthorized' || authState === 'unknown')) {
      return this.router.createUrlTree(['/login'])
    } else if (path !== 'signup' && authState === 'unregistered') {
      return this.router.createUrlTree(['/signup'])
    }
    return true
  }
}
