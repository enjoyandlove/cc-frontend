import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClubsService } from '../clubs.service';
import { EventsService } from '../../events/events.service';
import { EventsComponent } from '../../events/list/base/events.component';

@Component({
  selector: 'cp-clubs-events',
  template: '<cp-events [isSimple]="isSimple" [storeId]="4443"></cp-events>'
})
export class ClubsEventsComponent extends EventsComponent implements OnInit {
  clubId: number;
  isSimple = true;

  constructor(
    private route: ActivatedRoute,
    public eventsService: EventsService,
    private clubsService: ClubsService
  ) {
    super(eventsService);
    this.clubId = this.route.parent.snapshot.params['clubId'];
  }

  getClubDetails() {
    this
      .clubsService
      .getClubById(this.clubId)
      .subscribe(
        res => {
          console.log(res);
        },
        err => console.log(err)
      );
  }

  ngOnInit() {
    this.getClubDetails();
  }
}