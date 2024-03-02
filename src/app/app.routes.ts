import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { CocktailsComponent } from './modules/settings/cocktails/cocktails.component';
import { IngredientsComponent } from './modules/settings/ingredients/ingredients.component';
import { PumpsComponent } from './modules/settings/pumps/pumps.component';
import { SettingsComponent } from './modules/settings/settings.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'ingredients',
    component: IngredientsComponent,
  },
  {
    path: 'cocktails',
    component: CocktailsComponent,
  },
  {
    path: 'pumps',
    component: PumpsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
