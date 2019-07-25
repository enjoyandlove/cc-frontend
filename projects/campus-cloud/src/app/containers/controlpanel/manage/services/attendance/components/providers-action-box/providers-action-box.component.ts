import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { IDateRange } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { EngagementService } from '@controlpanel/assess/engagement/engagement.service';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';

@Component({
  selector: 'cp-providers-action-box',
  templateUrl: './providers-action-box.component.html',
  styleUrls: ['./providers-action-box.component.scss']
})
export class ServicesProviderActionBoxComponent implements OnInit {
  @Input() noProviders;

  @Output() download: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<null> = new EventEmitter();
  @Output() filterByDates: EventEmitter<IDateRange> = new EventEmitter();
  @Output() launchAddProviderModal: EventEmitter<null> = new EventEmitter();
  @Output() updateStudentFilter: EventEmitter<EngageUtils.IStudentFilter> = new EventEmitter();

  studentFilter$: Observable<any[]>;
  dateRanges: EngageUtils.IDateFilter[];

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public engageService: EngagementService,
    public engageUtils: EngageUtils.EngagementUtilsService
  ) {}

  onDownload() {
    this.download.emit();
  }

  onLaunchProviderAdd() {
    this.launchAddProviderModal.emit();
  }

  onSearch(query) {
    this.search.emit(query);
  }

  onDateChange(dateRange) {
    if (dateRange.payload) {
      dateRange = {
        label: dateRange.label,
        start: dateRange.payload.range.start,
        end: dateRange.payload.range.end
      };
    }
    this.filterByDates.emit(dateRange);
  }

  onStudentFilter(filter: EngageUtils.IStudentFilter) {
    this.updateStudentFilter.emit(filter);
  }

  ngOnInit() {
    this.studentFilter$ = this.engageUtils.getStudentFilter();
    this.dateRanges = this.engageUtils.dateFilter();
  }
}