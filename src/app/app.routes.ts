import { Routes } from '@angular/router';
import { MainComponent } from './main/main';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: '**', redirectTo: '' }
];
