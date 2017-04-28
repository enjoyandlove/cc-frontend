import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsExcelComponent } from '../events/excel/events-excel.component';

/**
 * CRUD
 */
import { ServicesListComponent } from './list';
import { ServicesEditComponent } from './edit';
import { ServicesInfoComponent } from './info';
import { ServicesCreateComponent } from './create';
import { ServicesEventsComponent } from './events';
import { ServicesAttendanceComponent } from './attendance';

import {
  ServicesEventsEditComponent,
  ServicesEventsInfoComponent,
  ServicesEventsCreateComponent,
  ServicesEventsFacebookComponent,
  ServicesEventsAttendanceComponent
} from './events/components';

import { ServicesProviderDetailsComponent } from './attendance/components';

/**
 * Excel
 */
import { ServicesExcelComponent } from './excel';


const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: ServicesListComponent },

  { path: 'create', component: ServicesCreateComponent },
  { path: ':serviceId/info', component: ServicesInfoComponent },
  { path: ':serviceId/edit', component: ServicesEditComponent },
  { path: ':serviceId/events', component: ServicesEventsComponent },

  { path: ':serviceId/events/create', component: ServicesEventsCreateComponent },
  { path: ':serviceId/events/:eventId', component: ServicesEventsAttendanceComponent },
  { path: ':serviceId/events/:eventId/info', component: ServicesEventsInfoComponent },

  { path: ':serviceId/events/:eventId/edit', component: ServicesEventsEditComponent },
  { path: ':serviceId/events/import/excel', component: EventsExcelComponent },
  { path: ':serviceId/events/import/facebook', component: ServicesEventsFacebookComponent },

  { path: ':serviceId', component: ServicesAttendanceComponent },

  { path: ':serviceId/provider/:providerId', component: ServicesProviderDetailsComponent },

  { path: 'import/excel', component: ServicesExcelComponent }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ServicesRoutingModule { }


// { path: 'create', component: EventsCreateComponent },
// { path: ':eventId', component: EventsAttendanceComponent },
// { path: ':eventId/edit', component: EventsEditComponent },
// { path: ':eventId/info', component: EventsInfoComponent },
