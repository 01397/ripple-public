import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router'
import { filter, take } from 'rxjs/operators'
import { AppService } from '../../app/app.service'

@Injectable({
  providedIn: 'root',
})
export class RegisteredGuard implements CanActivate {
  constructor(private app: AppService, private router: Router) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const authState = await this.app.authState
      .pipe(
        filter((v) => v !== 'unknown'),
        take(1)
      )
      .toPromise()
    const path = route.url[0].path
    if (path !== 'login' && (authState === 'unauthorized' || authState === 'unknown')) {
      return this.router.createUrlTree(['/login'])
    } else if (path !== 'signup' && authState === 'unregistered') {
      return this.router.createUrlTree(['/signup'])
    }
    return true
  }
}
