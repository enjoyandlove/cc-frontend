import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { CheckInMethod } from '../event.status';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes';
import { EventUtilService } from './../events.utils.service';
import { CPDate } from '../../../../../shared/utils/date/date';
import { BaseComponent } from '../../../../../base/base.component';
import { createSpreadSheet } from '../../../../../shared/utils/csv/parser';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

interface IState {
  sort_field: string;
  sort_direction: string;
  search_text: string;
}

const state = {
  sort_field: 'firstname',
  sort_direction: 'asc',
  search_text: null
};

@Component({
  selector: 'cp-events-attendance',
  templateUrl: './events-attendance.component.html',
  styleUrls: ['./events-attendance.component.scss']
})
export class EventsAttendanceComponent extends BaseComponent implements OnInit {
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isService: boolean;
  @Input() isAthletic: number;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  event;
  urlPrefix;
  attendees;
  sortingLabels;
  loading = true;
  eventId: number;
  state: IState = state;
  attendeesLoading = true;
  downloadEventProperties;
  dateFormat = FORMAT.DATETIME;

  eventProperties = {
    data_type: null,
    event_id: null,
    start_date: null,
    end_date: null,
    location: null
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public service: EventsService,
    private utils: EventUtilService,
    public cpTracking: CPTrackingService
  ) {
    super();
    this.eventId = this.route.snapshot.params['eventId'];
    super.isLoading().subscribe((res) => (this.attendeesLoading = res));
  }

  public fetch() {
    let search = new HttpParams();

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    super.fetchData(this.service.getEventById(this.eventId, search)).then((event) => {
      this.event = event.data;
      this.fetchAttendees();
      this.buildHeader(event.data);
      this.loading = false;
    });
  }

  public buildHeader(event) {
    const children = this.utils.getSubNavChildren(event, this.urlPrefix);

    const payload = {
      heading: `[NOTRANSLATE]${event.title}[NOTRANSLATE]`,

      subheading: '',

      crumbs: {
        url: this.urlPrefix,
        label: 'events'
      },

      children: [...children]
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  fetchAttendees() {
    let search = new HttpParams();

    search = search
      .append('event_id', this.event.id)
      .append('sort_field', this.state.sort_field)
      .append('search_text', this.state.search_text)
      .append('sort_direction', this.state.sort_direction);

    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    super
      .fetchData(stream$)
      .then((res) => (this.attendees = res.data))
      .catch((_) => {});
  }

  onPaginationNext() {
    super.goToNext();
    this.fetchAttendees();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetchAttendees();
  }

  doSort(sort_field) {
    this.state = Object.assign({}, this.state, {
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    });
    this.fetchAttendees();
  }

  checkInMethodType(method) {
    return method === CheckInMethod.web ? 'computer' : 'smartphone';
  }

  doSearch(search_text): void {
    search_text = search_text === '' ? null : search_text;
    this.state = Object.assign({}, this.state, { search_text });

    this.resetPagination();

    this.fetchAttendees();
  }

  onCreateExcel() {
    let search = new HttpParams().append('event_id', this.event.id).append('all', '1');

    if (this.isOrientation) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }
    const stream$ = this.service.getEventAttendanceByEventId(
      this.startRange,
      this.endRange,
      search
    );

    this.trackAmplitudeEvent();

    stream$.toPromise().then((attendees: Array<any>) => {
      const columns = [
        this.cpI18n.translate('events_attendant'),
        this.cpI18n.translate('events_attendee_email'),
        this.cpI18n.translate('events_checked_in_time'),
        this.cpI18n.translate('rating'),
        this.cpI18n.translate('events_user_feedback'),
        this.cpI18n.translate('events_checked_in_method'),
        this.cpI18n.translate('student_id')
      ];

      const check_in_method = {
        1: 'Web',
        3: 'QR Code'
      };

      attendees = attendees.map((item) => {
        return {
          [this.cpI18n.translate('events_attendant')]: `${item.firstname} ${item.lastname}`,

          [this.cpI18n.translate('events_attendee_email')]: item.email,

          [this.cpI18n.translate('events_checked_in_time')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format('MMMM Do YYYY - h:mm a'),

          [this.cpI18n.translate('rating')]:
            item.feedback_rating === -1 ? '' : (item.feedback_rating * 5 / 100).toFixed(2),

          [this.cpI18n.translate('events_user_feedback')]: item.feedback_text,

          [this.cpI18n.translate('events_checked_in_method')]: check_in_method[
            item.check_in_method
            ],

          [this.cpI18n.translate('student_id')]: item.student_identifier
        };
      });

      createSpreadSheet(attendees, columns);
    });
  }

  trackAmplitudeEvent() {
    this.downloadEventProperties = {
      data_type: amplitudeEvents.EVENT
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DOWNLOAD_DATA,
      this.downloadEventProperties
    );
  }

  ngOnInit() {
    this.urlPrefix = this.utils.buildUrlPrefix(
      this.clubId,
      this.serviceId,
      this.isAthletic,
      this.orientationId
    );

    this.sortingLabels = {
      rating: this.cpI18n.translate('rating'),
      name: this.cpI18n.translate('attendee'),
      method: this.cpI18n.translate('events_checked_in_method')
    };

    this.fetch();
  }
}
