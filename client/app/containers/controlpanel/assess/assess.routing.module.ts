import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { AssessComponent } from './assess.component';


const appRoutes: Routes = [
  {
    path: '',
    component: AssessComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', loadChildren: './engagement/engagement.module#EngagementModule' },

    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AssessRoutingModule {}
