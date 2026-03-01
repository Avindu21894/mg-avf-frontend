import { Routes } from '@angular/router';
import { LandingComponent } from './module/landing/landing.component';
import { MgAvfComponent } from './module/mg-avf/mg-avf.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'try-demo', component: MgAvfComponent }
];
