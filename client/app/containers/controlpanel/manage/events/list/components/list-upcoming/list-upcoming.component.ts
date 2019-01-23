import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  canSchoolWriteResource,
  canAccountLevelReadResource
} from './../../../../../../../shared/utils/privileges/privileges';

import IEvent from '../../../event.interface';
import { EventAttendance } from '../../../event.status';
import { FORMAT } from '../../../../../../../shared/pipes';
import { CPSession } from './../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, RouteLevel } from '../../../../../../../shared/services';

interface ISort {
  sort_field: string;
  sort_direction: string;
}

const sort = {
  sort_field: 'title', // title, start, end
  sort_direction: 'asc' // asc, desc
};

@Component({
  selector: 'cp-list-upcoming',
  templateUrl: './list-upcoming.component.html',
  styleUrls: ['./list-upcoming.component.scss']
})
export class ListUpcomingComponent implements OnInit {
  @Input() state: any;
  @Input() events: any;
  @Input() isClub: boolean;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() isOrientation: boolean;

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<ISort> = new EventEmitter();

  canDelete;
  eventData;
  sortingLabels;
  eventCheckinRoute;
  sort: ISort = sort;
  dateFormat = FORMAT.SHORT;
  attendanceEnabled = EventAttendance.enabled;
  isExternalToolTip = this.cpI18n.translate('t_events_list_external_source_tooltip');

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: EventUtilService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete(event) {
    if (event.is_external) {
      return;
    }

    this.deleteEvent.emit(event);
    $('#deleteEventsModal').modal();
    this.trackDeleteEvent();
  }

  doSort(sort_field) {
    const sort_direction = this.state.sort_direction === 'asc' ? 'desc' : 'asc';

    this.sort = Object.assign({}, this.sort, { sort_field, sort_direction });

    this.sortList.emit(this.sort);
  }

  trackDeleteEvent() {
    const eventProperties = this.setEventProperties();
    delete eventProperties['page_type'];

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, eventProperties);
  }

  setEventProperties() {
    return {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth),
      page_type: amplitudeEvents.UPCOMING_EVENT
    };
  }

  trackCheckinEvent(event: IEvent) {
    const eventProperties = {
      source_id: event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: this.utils.getEventCategoryType(event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CC_WEB_CHECK_IN, eventProperties);
  }

  ngOnInit() {
    $(function() {
      $('[data-toggle="tooltip"]').tooltip({
        placement: 'bottom'
      });
    });
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.setEventProperties()
    };

    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);
    const scholAccess = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const accountAccess = canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    this.canDelete = scholAccess || accountAccess || this.isOrientation;

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      start_date: this.cpI18n.translate('start_date')
    };
  }
}
