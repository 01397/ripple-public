import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { HeaderComponent } from './header/header.component'
import { HomeComponent } from './home/home.component'
import { Routes, RouterModule } from '@angular/router'
import { CoursesComponent } from './courses/courses.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { SettingsComponent } from './settings/settings.component'
import { LessonComponent } from './lesson/lesson.component'

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    CoursesComponent,
    NotificationsComponent,
    NotFoundComponent,
    SettingsComponent,
    LessonComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
