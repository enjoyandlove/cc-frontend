import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { CPSession } from './../../../../session/index';
import { EngagementService } from './engagement.service';
import { AssessUtilsService } from '../assess.utils.service';
import { CPTrackingService } from '../../../../shared/services';
import { BaseComponent } from '../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../reducers/snackbar.reducer';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { createSpreadSheet } from './../../../../shared/utils/csv/parser';
import { CPI18nService } from './../../../../shared/services/i18n.service';

declare var $;

const ONE_ENGAGEMENT = 2;
const ZERO_ENGAGEMENT = 3;
const REPEAT_ENGAGEMENT = 1;

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent extends BaseComponent implements OnInit {
  chartData;
  loading;
  messageData;
  filterState;
  isComposeModal;
  eventProperties;

  filters$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public router: Router,
    public store: Store<any>,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: AssessUtilsService,
    public service: EngagementService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  updateUrl() {
    this.router.navigate(['/assess/dashboard'], {
      queryParams: {
        engagement: this.filterState.engagement.route_id,
        for: this.filterState.for.route_id,
        range: this.filterState.range.route_id
      }
    });
  }

  onDoFilter(filterState) {
    this.filterState = Object.assign({}, this.filterState, ...filterState);

    this.updateUrl();

    this.fetchChartData();

    this.filters$.next(this.filterState);
  }

  buildSearchHeaders(): HttpParams {
    return new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('user_list_id', this.filterState.for.listId)
      .append('start', `${this.filterState.range.payload.range.start}`)
      .append('end', `${this.filterState.range.payload.range.end}`)
      .append(this.filterState.engagement.data.queryParam, this.filterState.engagement.data.value);
  }

  fetchChartData() {
    const search = this.buildSearchHeaders();

    super.fetchData(this.service.getChartData(search)).then((res) => {
      this.chartData = {
        ...res.data,
        starts: this.filterState.range.payload.range.start,
        ends: this.filterState.range.payload.range.end
      };
    });
  }

  onDoCompose(data): void {
    this.messageData = data;
    this.isComposeModal = true;
    setTimeout(
      () => {
        $('#composeModal').modal();
      },

      1
    );
  }

  onDownload(cohort) {
    let engagement_type = amplitudeEvents.ALL_ENGAGEMENT;
    let fileName = 'all_download_data';
    let search = this.buildSearchHeaders();
    search = search.append('download', '1');

    if (cohort) {
      search = search.append('cohort', cohort);

      switch (cohort) {
        case REPEAT_ENGAGEMENT:
          fileName = 'repeat_engagement';
          engagement_type = amplitudeEvents.MULTIPLE_ENGAGEMENT;
          break;
        case ONE_ENGAGEMENT:
          fileName = 'one_engagement';
          engagement_type = amplitudeEvents.ONE_ENGAGEMENT;
          break;
        case ZERO_ENGAGEMENT:
          fileName = 'zero_engagement';
          engagement_type = amplitudeEvents.NO_ENGAGEMENT;
          break;
      }
    }

    this.service
      .getChartData(search)
      .toPromise()
      .then((data: any) => {
        this.trackDownloadEvent(engagement_type);

        const columns = [
          this.cpI18n.translate('assess_student_name'),
          this.cpI18n.translate('assess_number_of_checkins'),
          this.cpI18n.translate('assess_number_of_responses'),
          this.cpI18n.translate('assess_response_rate'),
          this.cpI18n.translate('assess_average_rating'),
          this.cpI18n.translate('assess_number_of_event_checkins'),
          this.cpI18n.translate('assess_event_responses'),
          this.cpI18n.translate('assess_event_responses_rate'),
          this.cpI18n.translate('assess_event_rating_average'),
          this.cpI18n.translate('assess_service_checkins'),
          this.cpI18n.translate('assess_service_responses'),
          this.cpI18n.translate('assess_service_responses_rate'),
          this.cpI18n.translate('assess_service_rating_average'),
          this.cpI18n.translate('assess_student_id')
        ];

        const parsedData = data.download_data.map((item) => {
          return {
            [this.cpI18n.translate('assess_student_name')]: `${item.firstname} ${item.lastname}`,

            [this.cpI18n.translate('assess_number_of_checkins')]: item.total_checkins,

            [this.cpI18n.translate('assess_number_of_responses')]: item.total_responses,

            [this.cpI18n.translate('assess_response_rate')]: `${item.total_response_rate.toFixed(
              1
            )}%`,

            [this.cpI18n.translate('assess_average_rating')]: `${(item.event_ratings +
              item.service_ratings) /
              2}%`,

            [this.cpI18n.translate('assess_number_of_event_checkins')]: item.event_checkins,

            [this.cpI18n.translate('assess_event_responses')]: item.event_responses,

            [this.cpI18n.translate(
              'assess_event_responses_rate'
            )]: `${item.event_response_rate.toFixed(1)}%`,

            [this.cpI18n.translate('assess_event_rating_average')]: item.event_ratings,

            [this.cpI18n.translate('assess_service_checkins')]: item.service_checkins,

            [this.cpI18n.translate('assess_service_responses')]: item.service_responses,

            [this.cpI18n.translate(
              'assess_service_responses_rate'
            )]: `${item.service_response_rate.toFixed(1)}%`,

            [this.cpI18n.translate('assess_service_rating_average')]: item.service_ratings,

            [this.cpI18n.translate('assess_student_id')]: item.student_identifier
          };
        });
        createSpreadSheet(parsedData, columns, fileName);
      });
  }

  onComposeTeardown() {
    this.isComposeModal = false;
    this.messageData = null;
  }

  onFlashMessage(data) {
    this.trackMessageEvent(data);
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('announcement_success_sent'),
        autoClose: true
      }
    });
  }

  trackMessageEvent(data) {
    this.eventProperties = {
      ...this.utils.getEventProperties(this.filterState),
      host_type: data.hostType,
      engagement_type: data.props.label
    };
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.ASSESS_SENT_MESSAGE, this.eventProperties);
  }

  trackDownloadEvent(engagement_type) {
    this.eventProperties = {
      ...this.utils.getEventProperties(this.filterState),
      engagement_type
    };
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.ASSESS_DOWNLOAD_DATA, this.eventProperties);
  }

  ngOnInit() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../assess.header.json')
    });
  }
}
