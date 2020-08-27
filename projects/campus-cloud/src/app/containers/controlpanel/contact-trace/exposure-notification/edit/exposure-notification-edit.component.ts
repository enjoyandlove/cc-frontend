import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  ExposureNotification,
  ExposureNotificationService
} from '@controlpanel/contact-trace/exposure-notification';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { AnnouncementPriority } from '@controlpanel/notify/announcements/model';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import * as fromStore from '@controlpanel/contact-trace/cases/store';
import { ICase } from '@controlpanel/contact-trace/cases/cases.interface';
import { HttpParams } from '@angular/common/http';
import { CasesService } from '@controlpanel/contact-trace/cases/cases.service';

@Component({
  selector: 'cp-exposure-notification-edit',
  templateUrl: './exposure-notification-edit.component.html',
  styleUrls: ['./exposure-notification-edit.component.scss']
})
export class ExposureNotificationEditComponent implements OnInit, OnDestroy {
  protected unsubscribe: Subject<void> = new Subject();
  notification: ExposureNotification = {};
  webServiceCallInProgress: boolean;
  types = [
    {
      action: AnnouncementPriority.regular,
      disabled: false,
      label: this.cpI18n.translate('regular'),
      description: this.cpI18n.translate('announcements_regular_help')
    },
    {
      action: AnnouncementPriority.urgent,
      disabled: false,
      label: this.cpI18n.translate('urgent'),
      description: this.cpI18n.translate('announcements_urgent_help')
    }
  ];
  toOptions = [
    {
      action: 'case_status',
      disabled: false,
      label: this.cpI18n.translate('contact_trace_notification_case_status')
    },
    {
      action: 'custom_list',
      disabled: false,
      label: this.cpI18n.translate('contact_trace_notification_custom_list')
    }
  ];

  toCaseOption = [
    {
      action: 'custom_list',
      disabled: false,
      label: this.cpI18n.translate('contact_trace_notification_custom_list')
    }
  ];
  templates;
  filterOptions;
  selectedType;
  selectedToOption;
  selectedTemplate;
  selectedFilterOption;
  subject_prefix = {
    label: null,
    type: null
  };
  highlightFormError: boolean;
  templateTypeToTemplateMap;
  CaseActionToTemplateTypeMap;
  caseId: number;

  private getCasesById$: Observable<any>;
  private casesById: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: ExposureNotificationService,
    private store: Store<IHeader>,
    private caseStore: Store<fromStore.State>,
    private router: Router,
    private cpI18n: CPI18nService,
    private session: CPSession,
    private casesService: CasesService
  ) {

    this.CaseActionToTemplateTypeMap = {
      'ct:exposed_notify' : 2,
      'ct:symptomatic_notify' : 3,
      'ct:self_reported_notify' : 4,
      'ct:trace_contacts' : 2,
      'ct:exposure_notify' : 2
    };
  }

  ngOnDestroy() {
    // Do this to un-subscribe all subscriptions on this page
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
      const notificationId: number = Number(params['notificationId']);
      this.getItemForEdit(notificationId).subscribe((notification) => {
        this.notification = notification;
        this.buildHeader();
      });
    });

    this.getNotificationTemplates();
    this.getCaseStatuses();
    this.initNotificationForm();
  }

  private getItemForEdit(notificationId: number): Observable<ExposureNotification> {
    if (!notificationId) {
      const serviceId: number = this.session.g.get('school').ct_service_id;
      return this.notificationService.getStoreId(serviceId).pipe(
        map((storeId) => {
          const newObj: ExposureNotification = {
            type: 1,
            store_id: storeId
          };
          return newObj;
        })
      );
    }
    return this.notificationService.getNotification(notificationId);
  }

  private buildHeader() {
    const payload = {
      heading: 'contact_trace_notification_notify',
      em: null,
      crumbs: {
        url: 'exposure-notification',
        label: 'contact_trace_exposure_notification'
      },
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload
      });
    });
  }

  cancelClickHandler(): void {
    if (this.caseId) {
      window.history.back();
    }

    this.router.navigate(['/contact-trace/exposure-notification']);
  }

  onSchedule(scheduledAt: number) {
    this.notification.notify_at_epoch = scheduledAt;
  }

  onTypeChanged(type): void {
    this.setPriority(type.action);
  }

  onToOptionChanged(option): void {
    this.selectedToOption = option;
  }

  onTemplateOptionChanged(option): void {
    this.selectedTemplate = option;
    const selectedTemplate = this.templateTypeToTemplateMap[option.action];
    if (selectedTemplate) {
      this.setPriority(selectedTemplate.priority);
      this.notification.subject = selectedTemplate.subject;
      this.notification.message = selectedTemplate.message;
    }
  }

  private setPriority(priority): void {
    this.subject_prefix = {
      label: null,
      type: null
    };

    if (priority === AnnouncementPriority.emergency) {
      this.subject_prefix = {
        label: this.cpI18n.translate('emergency'),
        type: 'danger'
      };
    }

    if (priority === AnnouncementPriority.urgent) {
      this.subject_prefix = {
        label: this.cpI18n.translate('urgent'),
        type: 'warning'
      };
    }

    this.notification.priority = priority;
    this.selectedType = this.getObjectFromTypesArray(priority);
  }

  onFilterOptionChanged(option): void {
    this.selectedFilterOption = option;
  }

  private getObjectFromTypesArray(id) {
    let result;

    this.types.forEach((type) => {
      if (type.action === id) {
        result = type;
      }
    });

    return result;
  }

  usersChanged(userIds): void {
    this.notification.user_ids = userIds;
  }

  sendClickHandler(): void {
    if (this.casesById) {
      this.notification.user_ids = [this.casesById.user_id];
    }
    this.highlightFormError = false;
    const errorMessages: string[] = this.validateBeforeSave(this.notification);
    if (errorMessages && errorMessages.length > 0) {
      this.showWarning();
      this.highlightFormError = true;
    } else {
      this.webServiceCallInProgress = true;
      this.notificationService
        .createNotification(this.notification)
        .pipe(finalize(() => (this.webServiceCallInProgress = false)))
        .subscribe((notification) => {
          if (this.caseId) {
            const param = new HttpParams().set('school_id', this.session.g.get('school').id);
            this.casesService
              .updateCase(
                {
                  ...this.casesById,
                  perform_current_action: true
                },
                this.caseId,
                param
              )
              .subscribe((value) => this.handleSaveSuccess(notification));
          } else {
            return this.handleSaveSuccess(notification);
          }
        });
    }
  }

  isNullOrEmptyString(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  private handleSaveSuccess(notification: ExposureNotification): void {
    this.handleSuccess('contact_trace_notification_successfully_saved');
    if (this.caseId) {
      window.history.back();
    }
    this.router.navigate(['/contact-trace/exposure-notification']);
  }

  private validateBeforeSave(notification: ExposureNotification): string[] {
    const errorMessages: string[] = [];

    if (notification) {
      if (
        this.selectedToOption &&
        this.selectedToOption.action === 'custom_list' &&
        (!notification.user_ids || notification.user_ids.length === 0)
      ) {
        errorMessages.push('User Ids');
      }
      if (!notification.subject || notification.subject.trim().length === 0) {
        errorMessages.push('Subject');
      }
      if (!notification.message || notification.message.trim().length === 0) {
        errorMessages.push('Message');
      }
    }

    return errorMessages;
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private showWarning() {
    const options = {
      class: 'warning',
      body: this.cpI18n.translate('error_fill_out_marked_fields')
    };

    this.dispatchSnackBar(options);
  }

  private dispatchSnackBar(options) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        ...options,
        sticky: true,
        autoClose: true
      }
    });
  }

  private getNotificationTemplates(): void {
    this.notificationService.searchNotificationTemplates().subscribe((templates) => {
      this.templateTypeToTemplateMap = {};
      this.templates = [
        {
          action: null,
          label: this.cpI18n.translate('contact_trace_notification_none')
        }
      ];
      if (templates) {
        templates.forEach((template) => {
          this.templateTypeToTemplateMap[template.type] = template;
          this.templates.push({
            action: template.type,
            label: template.name
          });
        });
      }
    });
  }

  private getCaseStatuses(): void {
    this.notificationService.searchCaseStatuses().subscribe((statuses) => {
      this.filterOptions = [];
      if (statuses) {
        statuses.forEach((status) => {
          this.filterOptions.push({
            action: status.id,
            label: status.name
          });
        });
      }
    });
  }

  initNotificationForm(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.caseId = Number(params['case_id']);
      if (this.caseId) {
        this.webServiceCallInProgress = true;
        this.getCasesById$ = this.caseStore
          .select(fromStore.getCasesById)
          .pipe(filter((res: ICase) => !!res));
        const param = new HttpParams().set('school_id', this.session.g.get('school').id);
        this.casesService.getCaseById(param, this.caseId).subscribe((value) => {
          this.casesById = value;

          this.onToOptionChanged({
            action: 'custom_list',
            disabled: false,
            label: this.cpI18n.translate('contact_trace_notification_custom_list')
          });
          setTimeout(() => {
            const templateType = this.CaseActionToTemplateTypeMap[this.casesById.current_action.code];
            this.onTemplateOptionChanged({
              action: templateType,
              label: this.templateTypeToTemplateMap[templateType].name
            });
            this.webServiceCallInProgress = false;
          }, 500);
        });
      }
    });
  }
}
