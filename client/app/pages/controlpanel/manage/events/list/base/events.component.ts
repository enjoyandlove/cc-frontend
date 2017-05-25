import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { EventsService } from '../../events.service';
import { CPSession } from '../../../../../../session';
import { CPState } from '../../../../../../shared/utils';
import { BaseComponent } from '../../../../../../base/base.component';

interface IState {
  start: number;
  end: number;
  search_str: string;
  store_id: number;
  attendance_only: number;
  sort_field: string;
  sort_direction: string;
  events: any[];
  exclude_current: number;
}

const state = {
  start: null,
  end: null,
  store_id: null,
  search_str: null,
  attendance_only: 0,
  sort_field: 'start',
  sort_direction: 'asc',
  exclude_current: null,
  events: []
};

@Component({
  selector: 'cp-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() storeId: number;

  @Input() serviceId: number;
  @Input() isService: boolean;

  @Input() clubId: number;
  @Input() isClub: boolean;

  school;
  events;
  loading;
  pageNext;
  pagePrev;
  pageNumber;
  isUpcoming;
  deleteEvent = '';
  state: IState = state;

  constructor(
    public session: CPSession,
    public service: EventsService
  ) {
    super();
    this.school = this.session.school;
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch(stream$) {

    super
      .fetchData(stream$)
      .then(res => {
        this.state = Object.assign({}, this.state, { events: res.data });
      })
      .catch(err => console.error(err));
  }

  onSortList(sort) {
    this.state = Object.assign(
      {},
      this.state,
      {
        sort_field: sort.sort_field,
        sort_direction: sort.sort_direction
      }
    );

    this.buildHeaders();
  }

  doFilter(filter) {
    let storeId;
    let isUpcoming = filter.upcoming;

    if (this.isClub) {
      storeId = this.clubId;
    }

    if (this.isService) {
      storeId = this.serviceId;
    }

    this.state = Object.assign(
      {},
      this.state,
      {
        end: filter.end,
        start: filter.start,
        sort_field: 'start',
        exclude_current: null,
        sort_direction: 'asc',
        store_id: storeId ? storeId : filter.store_id,
        search_str: filter.search_str,
        attendance_only: filter.attendance_only
      }
    );

    if (!isUpcoming) {
      this.state = Object.assign(
        {},
        this.state,
        {
          sort_field: 'end',
          exclude_current: 1,
          sort_direction: 'desc',
        }
      );
    }

    this.isUpcoming = isUpcoming;

    this.buildHeaders();
  }

  buildHeaders() {
    let end = this.endRange;
    let start = this.startRange;
    let search = new URLSearchParams();

    let exclude_current = this.state.exclude_current ?
      this.state.exclude_current.toString() : null;

    let store_id = this.state.store_id ? (this.state.store_id).toString() : null;

    if (this.storeId) {
      store_id = this.storeId.toString();
    }

    search.append('start', (this.state.start).toString());
    search.append('end', (this.state.end).toString());
    search.append('store_id', store_id);
    search.append('school_id', this.session.school.id.toString());
    search.append('search_str', this.state.search_str);
    search.append('exclude_current', exclude_current);
    search.append('attendance_only', (this.state.attendance_only).toString());

    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);

    this.fetch(this.service.getEvents(start, end, search));
  }

  onDeleteEvent(event) {
    this.deleteEvent = event;
  }

  onDeletedEvent(eventId) {
    const _state = CPState.deleteById(this.state, 'events', eventId);

    this.state = Object.assign({}, this.state, _state);
  }

  onPaginationNext() {
    super.goToNext();

    this.buildHeaders();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.buildHeaders();
  }

  ngOnDestroy() {
    // console.log('destroy');
  }

  ngOnInit() {
    // console.log(this);
  }
}
