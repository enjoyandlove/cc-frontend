import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/config/guards';

import { ManageComponent } from './manage.component';
import { CanDeactivateDining } from './dining/guards/dining-guard';
import { CanDeactivateLocations } from './locations/locations.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: ManageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'events',
        data: { zendesk: 'events' },
        loadChildren: './events/events.module#EventsModule'
      },

      {
        path: 'services',
        data: { zendesk: 'services' },
        loadChildren: './services/services.module#ServicesModule'
      },

      {
        path: 'clubs',
        data: { zendesk: 'clubs' },
        loadChildren: './clubs/clubs.module#ClubsModule'
      },

      {
        path: 'athletics',
        data: { zendesk: 'athletics' },
        loadChildren: './athletics/athletics.module#AthleticsModule'
      },

      {
        path: 'links',
        data: { zendesk: 'links' },
        loadChildren: './links/links.module#LinksModule'
      },

      {
        path: 'feeds',
        data: { zendesk: 'walls' },
        loadChildren: './feeds/feeds.module#FeedsModule'
      },

      {
        path: 'clubs',
        data: { zendesk: 'clubs' },
        loadChildren: './clubs/clubs.module#ClubsModule'
      },

      {
        path: 'calendars',
        data: { zendesk: 'calendars' },
        loadChildren: './calendars/calendars.module#CalendarsModule'
      },

      {
        path: 'locations',
        data: { zendesk: 'locations' },
        canDeactivate: [CanDeactivateLocations],
        loadChildren: './locations/locations.module#LocationsModule'
      },

      {
        path: 'dining',
        data: { zendesk: 'dining' },
        canDeactivate: [CanDeactivateDining],
        loadChildren: './dining/dining.module#DiningModule'
      },

      {
        path: 'orientation',
        data: { zendesk: 'orientation' },
        loadChildren: './orientation/orientation.module#OrientationModule'
      },

      {
        path: 'jobs',
        data: { zendesk: 'jobs' },
        loadChildren: './jobs/jobs.module#JobsModule'
      },

      {
        path: 'deals',
        data: { zendesk: 'deals' },
        loadChildren: './deals/deals.module#DealsModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CanDeactivateLocations, CanDeactivateDining]
})
export class ManageRoutingModule {}
