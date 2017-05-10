import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { ServicesService } from '../services.service';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-services-info',
  templateUrl: './services-info.component.html',
  styleUrls: ['./services-info.component.scss']
})
export class ServicesInfoComponent extends BaseComponent implements OnInit {
  service;
  loading = true;
  serviceId: number;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private serviceService: ServicesService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.serviceService.getServiceById(this.serviceId))
      .then(res => {
        this.service = res.data;
        this.buildHeader(res.data);
        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data.latitude,
            lng: res.data.longitude
          }
        );
      })
      .catch(err => console.error(err));
  }

  private buildHeader(res) {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': res.name,
        'subheading': '',
        'children': [
          {
            'label': 'Attendance',
            'url': `/manage/services/${this.serviceId}`
          },
          {
            'label': 'Events',
            'url': `/manage/services/${this.serviceId}/events`
          },
          {
            'label': 'Info',
            'url': `/manage/services/${this.serviceId}/info`
          }
        ]
      }
    });
  }

  ngOnInit() { }
}
