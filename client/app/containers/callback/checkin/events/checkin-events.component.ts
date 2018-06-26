import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CPSession } from '../../../../session';
import { CheckinService } from '../checkin.service';
import { BaseComponent } from '../../../../base/base.component';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, ErrorService } from './../../../../shared/services';

interface IState {
  events: Array<any>;
}

const state: IState = {
  events: []
};

@Component({
  selector: 'cp-checkin-events',
  templateUrl: './checkin-events.component.html',
  styleUrls: ['./checkin-events.component.scss']
})
export class CheckinEventsComponent extends BaseComponent implements OnInit {
  loading;
  isEvent = true;
  eventId: string;
  state: IState = state;
  search: HttpParams;

  @Input() isOrientation: boolean;

  constructor(
    public router: Router,
    public session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public errorService: ErrorService,
    public cpTracking: CPTrackingService,
    public checkinService: CheckinService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.eventId = this.route.snapshot.params['event'];
  }

  onSubmit(data) {
    this.checkinService
      .doEventCheckin(data, this.search)
      .subscribe(
        (_) => {
          this.updateAttendeesList(data);
          this.trackAmplitudeEvent(true);
          },
        (_) => this.errorService.handleError(this.cpI18n.translate('something_went_wrong'))
      );
  }

  updateAttendeesList(data) {
    this.state.events = Object.assign({}, this.state.events, {
      attendees: [data, ...this.state.events['attendees']]
    });
  }

  fetch() {
    super
      .fetchData(this.checkinService.getEventData(this.search, true))
      .then((res) => {
        this.state = Object.assign({}, this.state, { events: res.data });
      })
      .catch((_) => {
        this.router.navigate(['/login']);
      });
  }

  trackAmplitudeEvent(checkedin = false) {
    const check_in_type = this.isOrientation
      ? amplitudeEvents.ORIENTATION
      : amplitudeEvents.EVENT;

    const eventName = checkedin
      ? amplitudeEvents.MANAGE_CHECKEDIN_MANUALLY
      : amplitudeEvents.MANAGE_LOADED_CHECKIN;

    const eventProperties = {
      event_id: this.eventId,
      check_in_type
    };

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  ngOnInit() {
    if (!this.session.g.get('user')) {
      this.cpTracking.loadAmplitude();
    }

    this.trackAmplitudeEvent();
    this.search = new HttpParams().append('event_id', this.eventId);

    if (!this.eventId) {
      this.router.navigate(['/login']);
    }
    this.fetch();
  }
}
