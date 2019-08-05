import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CallbackService } from '../callback.service';

@Injectable()
export class FeedbackService {
  constructor(public api: CallbackService) {}

  getServiceData(search: HttpParams, silent) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_SERVICE_FEEDBACK}/`;

    return this.api.get(url, search, silent);
  }

  getEventData(search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_EVENT_FEEDBACK}/`;

    return this.api.get(url, search);
  }

  doEventFeedback(data: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_EVENT_FEEDBACK}/`;

    return this.api.update(url, data, search);
  }

  doServiceFeedback(data: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_SERVICE_FEEDBACK}/`;

    return this.api.update(url, data, search);
  }
}
