import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../config/api';
import { BaseService } from '../../base/base.service';

@Injectable()
export class StoreService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, StoreService.prototype);
  }

  getStores(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STORE}/1;1000`;

    if (!search.get('event_host_only')) {
      search.append('event_host_only', '1');
    }

    return super
      .get(url, { search })
      .map(res => {
        return res.json();
      })
      .startWith([{ 'label': 'All Hosts' }])
      .map(res => {
        const CLUBS_CATEGORY = 0;
        const SERVICES_CATEGORY = 19;

        let stores = [
          {
            'label': 'Select Host',
            'value': null,
            'heading': true,
          }
        ];

        let clubs = [
          {
            'label': 'Clubs',
            'value': null,
            'heading': true,
          }
        ];

        let services = [
          {
            'label': 'Services',
            'value': null,
            'heading': true,
          }
        ];

        res.forEach(store => {
          if (store.category_id === CLUBS_CATEGORY) {
            clubs.push({
              'label': store.name,
              'value': store.id,
              'heading': false,
            });
          }
          if (store.category_id === SERVICES_CATEGORY) {
            services.push({
              'label': store.name,
              'value': store.id,
              'heading': false,
            });
          }
        });

        if (clubs.length > 1) {
          stores.push(...clubs);
        }

        if (services.length > 1) {
          stores.push(...services);
        }

        if (clubs.length === 1 && services.length === 1) {
          stores[0].label = 'No Hosts Available'
        }

        return stores;
      });
  }

  getStoreById(storeId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.STORE}/${storeId}`;

    return super.get(url).map(res => res.json());
  }
}
