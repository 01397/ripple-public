import { DragDropModule } from '@angular/cdk/drag-drop'
import { HttpClientModule } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireAuthGuard, customClaims, redirectLoggedInTo } from '@angular/fire/auth-guard'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage'
import { AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics'
import { FormsModule } from '@angular/forms'
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
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'
import { firebase, FirebaseUIModule } from 'firebaseui-angular'
import { AceEditorModule } from 'ng2-ace-editor'
import { pipe } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from '../environments/environment'
import { MaterialComponent, MaterialDialog } from './admin/material/material.component'
import { UsersComponent } from './admin/users/users.component'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CoursesComponent } from './courses/courses.component'
import { DurationPipe } from './duration.pipe'
import { EditorComponent } from './editor/editor.component'
import { ExerciseEditorComponent } from './exercise-editor/exercise-editor.component'
import { ExerciseComponent } from './exercise/exercise.component'
import { FromNowPipe } from './from-now.pipe'
import { RegisteredGuard } from './guard/registered.guard'
import { HeaderComponent } from './header/header.component'
import { HomeComponent } from './home/home.component'
import { InMemoryApiService } from './in-memoryw-api.service'
import { JudgeResultComponent } from './judge-result/judge-result.component'
import { LessonItemComponent } from './lesson-item/lesson-item.component'
import { LessonComponent } from './lesson/lesson.component'
import { LoginComponent } from './login/login.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { SettingsComponent } from './settings/settings.component'
import { SidebarComponent } from './sidebar/sidebar.component'
import { SignupComponent } from './signup/signup.component'
import { SlideEditorElementComponent } from './slide-editor/element/element.component'
import { SlideEditorComponent } from './slide-editor/slide-editor.component'
import { SlideCodeComponent } from './slide/elements/slide-code/slide-code.component'
import { SlideElementComponent } from './slide/elements/slide-element.component'
import { SlideFillingCodeComponent } from './slide/elements/slide-filling-code/slide-filling-code.component'
import { SlideImageComponent } from './slide/elements/slide-image/slide-image.component'
import { SlideParagraphComponent } from './slide/elements/slide-paragraph/slide-paragraph.component'
import { SlideQuiz1Component } from './slide/elements/slide-quiz1/slide-quiz1.component'
import { SlideCodingComponent } from './slide/layouts/slide-coding/slide-coding.component'
import { SlideContainerComponent } from './slide/layouts/slide-container/slide-container.component'
import { SlideDirective } from './slide/layouts/slide-container/slide.directive'
import { SlideCoverComponent } from './slide/layouts/slide-cover/slide-cover.component'
import { SlideOneColumnComponent } from './slide/layouts/slide-one-column/slide-one-column.component'
import { SlideTopicComponent } from './slide/layouts/slide-topic/slide-topic.component'
import { SlideTwoColumnComponent } from './slide/layouts/slide-two-column/slide-two-column.component'
import { TermsComponent } from './terms/terms.component'

const origin = environment.origin
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
  tosUrl: origin + '/tos',
  privacyPolicyUrl: origin + '/privacy',
  signInSuccessUrl: origin + '/home',
  // credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  siteName: 'Ripple',
}

const redirectLoggedInToHome = () => redirectLoggedInTo(['home'])
const adminOnly = () =>
  pipe(
    customClaims,
    map((claims) => (claims.admin === true ? true : ['home']))
  )

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RegisteredGuard],
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
    canActivate: [RegisteredGuard],
  },
  // 規約更新時の同意確認
  {
    path: 'terms',
    component: TermsComponent,
    canActivate: [RegisteredGuard],
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [RegisteredGuard],
  },
  {
    path: 'lesson',
    component: LessonComponent,
    canActivate: [RegisteredGuard],
  },
  {
    path: 'admin/slide-editor',
    component: SlideEditorComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'admin/exercise-editor',
    component: ExerciseEditorComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [RegisteredGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [RegisteredGuard],
  },
  {
    path: 'admin/material',
    component: MaterialComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
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
    TermsComponent,
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
    AngularFireAnalyticsModule,
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
  providers: [
    InMemoryApiService,
    { provide: BUCKET, useValue: 'ripple-public.appspot.com' },
    AngularFireAuthGuard,
    ScreenTrackingService,
    UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
