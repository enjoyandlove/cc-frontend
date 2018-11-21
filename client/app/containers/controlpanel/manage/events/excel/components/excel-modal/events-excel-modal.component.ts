import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { isDev } from '../../../../../../../config/env';
import { EventsService } from '../../../events.service';
import { CPSession } from '../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { EventsComponent } from '../../../list/base/events.component';
import { FileUploadService } from '../../../../../../../shared/services';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'cp-events-excel-modal',
  templateUrl: './events-excel-modal.component.html',
  styleUrls: ['./events-excel-modal.component.scss']
})
export class EventsExcelModalComponent extends EventsComponent implements OnInit {
  @Input() storeId: number;
  @Input() clubId: number;
  @Input() isClub: boolean;
  @Input() serviceId: number;
  @Input() athleticId: number;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  options;
  fileName;
  urlPrefix;

  constructor(
    private router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService,
    private utils: EventUtilService,
    private fileService: FileUploadService
  ) {
    super(session, cpI18n, service);
  }

  parser(file) {
    const url = !isDev ? '/events/excel' : 'http://localhost:8000/events/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.service.setModalEvents(JSON.parse(res));

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.error.error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  onNavigate() {
    this.urlPrefix = this.utils.buildUrlPrefixExcel(this.getEventType());

    this.router.navigate([this.urlPrefix]);
  }

  ngOnInit() {
    this.fileName = 'mass_event_invite_sample.csv';

    const templateUrl = isDev
      ? `/public/templates/${this.fileName}`
      : `${environment.root}public/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
