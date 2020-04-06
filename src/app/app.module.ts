import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FirebaseUIModule, firebase } from 'firebaseui-angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { HeaderComponent } from './header/header.component'
import { HomeComponent } from './home/home.component'
import { Routes, RouterModule } from '@angular/router'
import { AceEditorModule } from 'ng2-ace-editor'
import { CoursesComponent } from './courses/courses.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { SettingsComponent } from './settings/settings.component'
import { LessonComponent } from './lesson/lesson.component'
import { EditorComponent } from './editor/editor.component'
import { SlideCoverComponent } from './slide/layouts/slide-cover/slide-cover.component'
import { SlideCodingComponent } from './slide/layouts/slide-coding/slide-coding.component'
import { SlideDirective } from './slide/layouts/slide-container/slide.directive'
import { SlideContainerComponent } from './slide/layouts/slide-container/slide-container.component'
import { SlideOneColumnComponent } from './slide/layouts/slide-one-column/slide-one-column.component'
import { SlideElementComponent } from './slide/elements/slide-element.component'
import { SlideParagraphComponent } from './slide/elements/slide-paragraph/slide-paragraph.component'
import { SlideTwoColumnComponent } from './slide/layouts/slide-two-column/slide-two-column.component'
import { SlideTopicComponent } from './slide/layouts/slide-topic/slide-topic.component'
import { SlideImageComponent } from './slide/elements/slide-image/slide-image.component'
import { SlideCodeComponent } from './slide/elements/slide-code/slide-code.component'
import { SlideQuiz1Component } from './slide/elements/slide-quiz1/slide-quiz1.component'
import { SlideFillingCodeComponent } from './slide/elements/slide-filling-code/slide-filling-code.component'
import { SlideEditorComponent } from './slide-editor/slide-editor.component'
import { SlideEditorElementComponent } from './slide-editor/element/element.component'
import { InMemoryApiService } from './in-memoryw-api.service'
import { environment } from '../environments/environment'
import { AngularFireModule } from '@angular/fire'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'
import { MaterialComponent, MaterialDialog } from './admin/material/material.component'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { ExerciseComponent } from './exercise/exercise.component'
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage'
import { ExerciseEditorComponent } from './exercise-editor/exercise-editor.component'
import { JudgeResultComponent } from './judge-result/judge-result.component'
import { LoginComponent } from './login/login.component'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { redirectLoggedInTo, redirectUnauthorizedTo, AngularFireAuthGuard } from '@angular/fire/auth-guard'
import { SignupComponent } from './signup/signup.component'
import { DurationPipe } from './duration.pipe'
import { FromNowPipe } from './from-now.pipe'
import { LessonItemComponent } from './lesson-item/lesson-item.component'
import { UsersComponent } from './admin/users/users.component'

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  autoUpgradeAnonymousUsers: false, // 匿名認証ユーザー自動アップグレード
  signInFlow: 'popup', // redirect or popup
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // // Team Of Service
  // tosUrl: 'http://localhost:6200/TOS',
  // privacyPolicyUrl: 'プライバシーポリシーのURL',
  // signInSuccessUrl: 'http://localhost:6200/home',
  // credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  siteName: 'Ripple',
}

const redirectLoggedInToHome = () => redirectLoggedInTo(['home'])
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login'])

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'lesson',
    component: LessonComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/slide-editor',
    component: SlideEditorComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/exercise-editor',
    component: ExerciseEditorComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'admin/material',
    component: MaterialComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
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
    EditorComponent,
    SlideCoverComponent,
    SlideCodingComponent,
    SlideDirective,
    SlideContainerComponent,
    SlideOneColumnComponent,
    SlideElementComponent,
    SlideParagraphComponent,
    SlideTwoColumnComponent,
    SlideTopicComponent,
    SlideImageComponent,
    SlideCodeComponent,
    SlideQuiz1Component,
    SlideFillingCodeComponent,
    SlideEditorComponent,
    SlideEditorElementComponent,
    MaterialComponent,
    MaterialDialog,
    ExerciseComponent,
    ExerciseEditorComponent,
    JudgeResultComponent,
    LoginComponent,
    SignupComponent,
    DurationPipe,
    FromNowPipe,
    LessonItemComponent,
    UsersComponent,
  ],
  entryComponents: [
    SlideCoverComponent,
    SlideCodingComponent,
    SlideOneColumnComponent,
    SlideTwoColumnComponent,
    SlideTopicComponent,
    SlideParagraphComponent,
    SlideImageComponent,
    SlideCodeComponent,
    SlideQuiz1Component,
    SlideFillingCodeComponent,
    MaterialDialog,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    AceEditorModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryApiService),
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatRadioModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    DragDropModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [InMemoryApiService, { provide: BUCKET, useValue: 'ripple-public.appspot.com' }, AngularFireAuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
