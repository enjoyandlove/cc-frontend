import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes';
import { StoreService } from '../../../../../shared/services';
import { BUTTON_DROPDOWN, DATE_FILTER } from './events-filters';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { BUTTON_ALIGN } from '../../../../../shared/components/cp-button-dropdown';
import { INPUT_THEME } from '../../../../../shared/components/cp-datepicker';

@Component({
  selector: 'cp-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent extends BaseComponent implements OnInit {
  events;
  query;
  hosts = [];
  eventFilter;
  dateFilterOpts;
  buttonDropdown;
  loading = true;
  deleteEvent = '';
  dateFormat = FORMAT.LONG;
  BUTTON_ALIGN = BUTTON_ALIGN.RIGHT;
  INPUT_THEME = INPUT_THEME.SMALL;

  constructor(
    private router: Router,
    private store: Store<IHeader>,
    private service: EventsService,
    private storeService: StoreService
  ) {
    super();
    this.buildActionComponent();
    this.buttonDropdown = BUTTON_DROPDOWN;
    this.eventFilter = DATE_FILTER;
    this.dateFilterOpts = {
      utc: true,
      mode: 'range',
      // onClose: function(selectedDates, dateStr, instance) {
      //   console.log(selectedDates);
      //   console.log(dateStr);
      //   console.log(instance);
      // }
    };
  }

  onFilterByEvent(action) {
    console.log(action);
  }

  onFilterByHost(host) {
    if (host) {
      this.fetch(this.service.getEventsByHostId(host));
      return;
    }
    this.fetch(this.service.getEvents());
  }

  buildActionComponent() {
    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'All Host',
          'action': null
        }
      ];
      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });
      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => {
        this.hosts = res;
        this.fetch(this.service.getEvents());
      })
      .catch(err => console.error(err));
  }

  onButtonDropdown(location) {
    this.router.navigate([location]);
  }

  private fetch(stream$) {
    // const stores$ = this.storeService.getStores().map(res => {
    //   const stores = [
    //     {
    //       'label': 'All Host',
    //       'action': null
    //     }
    //   ];
    //   res.forEach(store => {
    //     stores.push({
    //       'label': store.name,
    //       'action': store.id
    //     });
    //   });
    //   return stores;
    // });
    // const events$ = this.service.getEvents();
    // const stream$ = Observable.combineLatest(events$, stores$);

    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(stream$)
      .then(res => {
        this.events = res;
        this.buildHeader();
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../manage.header.json')
    });
  }

  shouldBeFilled(rating: number, index: number) {
    return rating > index ? true : false;
  }

  buildStars(event) {
    const stars = [];
    const MAX_RATING = event.rating_scale_maximum;
    const AVG_RATING = event.avg_rating_percent;
    const rating = AVG_RATING / MAX_RATING;

    for (let i = 0; i < MAX_RATING; i++) {
      stars.push({
        'filled': this.shouldBeFilled(rating, i)
      });
    }
    return stars;
  }

  ngOnInit() { }
}
