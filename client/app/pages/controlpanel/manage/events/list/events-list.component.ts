import { Component, OnInit } from '@angular/core';

import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent extends BaseComponent implements OnInit {
  events;
  query;
  loading = true;
  dateFormat = FORMAT.LONG;

  constructor(
    private service: EventsService
  ) {
    super();
    this.fetch();
  }

  onQueryChange(query) {
    console.log(query);
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    super
      .fetchData(this.service.getEvents())
      .then(res => this.events = res)
      .catch(err => console.error(err));
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
