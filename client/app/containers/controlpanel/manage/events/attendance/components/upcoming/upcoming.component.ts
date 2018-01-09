import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FORMAT } from '../../../../../../../shared/pipes/date';

@Component({
  selector: 'cp-attendance-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class AttendanceUpcomingComponent implements OnInit {
  @Input() event: any;

  banner;
  mapCenter;
  dateFormat;
  draggable = false;
  format = FORMAT.DATETIME;

  constructor() { }

  ngOnInit() {
    this.banner = this.event.poster_url === '' ?
                  this.event.store_logo_url : this.event.poster_url;

    this.dateFormat = FORMAT.DATETIME;
    this.mapCenter = new BehaviorSubject(
    {
      lat: this.event.latitude,
      lng: this.event.longitude
    }
    );
  }
}