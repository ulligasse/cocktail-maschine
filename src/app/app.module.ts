import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { SettingsComponent } from './modules/settings/settings.component';
import { HomeComponent } from './modules/home/home.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IngredientsComponent } from './modules/settings/ingredients/ingredients.component';
import { CocktailsComponent } from './modules/settings/cocktails/cocktails.component';
import { PumpsComponent } from './modules/settings/pumps/pumps.component';
import { DialogIngredientsComponent } from './modules/settings/ingredients/dialog-ingredients/dialog-ingredients.component';
import { AngularFireModule } from '@angular/fire/compat';
import { DialogCocktailsComponent } from './modules/settings/cocktails/dialog-cocktails/dialog-cocktails.component';
import { DialogPumpsComponent } from './modules/settings/pumps/dialog-pumps/dialog-pumps.component';
import { DialogConfirmComponent } from './modules/home/dialog-confirm/dialog-confirm.component';
import { LoginComponent } from './modules/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HomeComponent,
    IngredientsComponent,
    CocktailsComponent,
    PumpsComponent,
    DialogIngredientsComponent,
    DialogCocktailsComponent,
    DialogPumpsComponent,
    DialogConfirmComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
