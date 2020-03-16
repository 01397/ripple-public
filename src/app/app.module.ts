import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular'

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
import {
  MatInputModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatSelectModule,
  MatRadioModule,
  MatCardModule,
  MatMenuModule,
  MatButtonModule,
  MatCheckboxModule,
  MatListModule,
  MatSnackBarModule,
  MatIconModule,
  MatDialogModule,
} from '@angular/material'
import { HttpClientInMemoryWebApiModule, InMemoryDbService } from 'angular-in-memory-web-api'
import { MaterialComponent, MaterialDialog } from './admin/material/material.component'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { ExerciseComponent } from './exercise/exercise.component'
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage'
import { ExerciseEditorComponent } from './exercise-editor/exercise-editor.component'
import { JudgeResultComponent } from './judge-result/judge-result.component'
import { LoginComponent } from './login/login.component'
import { AngularFireAuthModule } from '@angular/fire/auth'

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  autoUpgradeAnonymousUsers: false, // 匿名認証ユーザー自動アップグレード
  signInFlow: 'popup', // redirect or popup
  signInOptions: [
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // {
    //   scopes: ['public_profile', 'email', 'user_likes', 'user_friends'],
    //   customParameters: {
    //     auth_type: 'reauthenticate',
    //   },
    //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    // {
    //   requireDisplayName: false,
    //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // },
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  // // Team Of Service
  // tosUrl: 'http://localhost:6200/TOS',
  // privacyPolicyUrl: 'プライバシーポリシーのURL',
  // signInSuccessUrl: 'http://localhost:6200/home',
  // credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  // siteName: 'Ripple',
}

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'lesson',
    component: LessonComponent,
  },
  {
    path: 'admin/slide-editor',
    component: SlideEditorComponent,
  },
  {
    path: 'admin/exercise-editor',
    component: ExerciseEditorComponent,
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'admin/material',
    component: MaterialComponent,
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
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    DragDropModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [InMemoryApiService, { provide: BUCKET, useValue: 'ripple-public.appspot.com' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
