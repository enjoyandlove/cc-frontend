import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { isDev } from '../../../../../config/env';
import { STATUS } from '../../../../../shared/constants';
import { CPSession, ISchool } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CPDate, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { StoreService, AdminService } from '../../../../../shared/services';


@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent extends BaseComponent implements OnInit {
  @Input() storeId: number;

  @Input() clubId: number;
  @Input() isClub: boolean;

  @Input() serviceId: number;
  @Input() isService: boolean;

  error;
  events;
  stores;
  formError;
  mockDropdown;
  isChecked = [];
  school: ISchool;
  loading = false;
  form: FormGroup;
  isFormReady = false;
  buttonDropdownOptions;
  eventAttendanceFeedback;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private adminService: AdminService,
    private storeService: StoreService,
    private eventsService: EventsService
  ) {
    super();
    this.school = this.session.school;
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', this.school.id.toString());

    const stores$ = this.storeService.getStores(search);

    if (!this.storeId && !this.clubId) {
      super
        .fetchData(stores$)
        .then(res => {
          this.buildForm();
          this.buildHeader();
          this.stores = res.data;
        })
        .catch(err => console.error(err));
    }
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Events from Excel',
        'em': `${this.events.length} calendar event(s) data information in the file`,
        'children': []
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'events': this.fb.array([])
    });
    this.buildGroup();

    if (this.isService) {
      this.updateManagersByStoreOrClubId(this.serviceId);
    }
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['events'];

    this.events.forEach((event, index) => {
      control.push(this.buildEventControl(event));
      this.isChecked.push({ index, checked: false });
    });


    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['events'];
    control.removeAt(index);
  }

  buildEventControl(event) {
    let store_id;

    if (this.storeId) {
      store_id = this.storeId;
    }

    if (this.clubId) {
      store_id = this.clubId;
    }

    return this.fb.group({
      'store_id': [store_id ? store_id : null, Validators.required],
      'room': [event.room],
      'title': [event.title, Validators.required],
      'poster_url': [null, Validators.required],
      'poster_thumb_url': [null, Validators.required],
      'location': [event.location],
      'managers': [[{ 'label': '---', 'event': null }]],
      'description': [event.description],
      'end': [CPDate.toEpoch(event.end_date), Validators.required],
      'start': [CPDate.toEpoch(event.start_date), Validators.required],
      // these controls are only required when event attendance is true
      'attendance_manager_email': [null],
      'event_manager_id': [null],
      'event_attendance': [1],
      'event_feedback': [1],
    });
  }

  updateEventManager(manager, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_manager_id'].setValue(manager.value);
  }

  updateAttendanceFeedback(feedback, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_feedback'].setValue(feedback.event);
  }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['events'];

    this.isChecked.map(item => {

      if (item.checked) {
        let ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach(key => {
          ctrl.controls[key].setValue(actions[key]);
        });
      }

      return item;
    });
  }

  onSingleHostSelected(host, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];
    const managers$ = this.getManagersByHostId(host.value);

    managers$.subscribe(res => {
      control.controls['managers'].setValue(res);
    });

    control.controls['event_manager_id'].setValue(null);
    control.controls['store_id'].setValue(host.value);
  }

  updateManagersByStoreOrClubId(storeId) {
    const events = <FormArray>this.form.controls['events'];
    const managers$ = this.getManagersByHostId(storeId);
    const groups = events.controls;

    managers$.subscribe(managers => {
      groups.forEach((group: FormGroup) => {
        group.controls['managers'].setValue(managers);
      });
    });
  }

  getManagersByHostId(storeId): Observable<any> {
    let search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeId);
    search.append('privilege_type', CP_PRIVILEGES_MAP.events.toString());

    return this
      .adminService
      .getAdminByStoreId(search)
      .startWith([{ 'label': '---' }])
      .map(admins => {
        let _admins = [
          {
            'label': '---',
            'value': null
          }
        ];
        admins.forEach(admin => {
          _admins.push({
            'label': `${admin.firstname} ${admin.lastname}`,
            'value': admin.id
          });
        });
        return _admins;
      });
  }

  onSingleCheck(checked, index) {
    let _isChecked;

    _isChecked = this.isChecked.map(item => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }
      return item;
    });
    this.isChecked = [..._isChecked];
  }

  onCheckAll(checked) {
    let _isChecked = [];

    this.isChecked.map((item) => {
      _isChecked.push(Object.assign({}, item, { checked: checked }));
    });

    this.isChecked = [..._isChecked];
  }

  onHostBulkChange(store_id) {
    this.onBulkChange({ store_id });
  }

  onImageBulkChange(poster_url) {
    this.onBulkChange({ poster_url });
    this.onBulkChange({ poster_thumb_url: poster_url });
  }

  onSubmit() {
    this.error = null;
    let _events = [];
    this.formError = false;
    let requiredFieldsError = false;
    let events = Object.assign({}, this.form.controls['events'].value);

    const eventsData = <FormArray>this.form.controls['events'];
    const eventGroups = eventsData.controls;

    Object.keys(eventGroups).forEach(index => {
      let controls = eventGroups[index].controls;
      if (controls.event_attendance.value === 1) {
        if (!controls.event_manager_id.value) {
          requiredFieldsError = true;
          controls.event_manager_id.setErrors({ 'required': true });
        }
        if (!controls.event_attendance.value) {
          requiredFieldsError = true;
          controls.event_attendance.setErrors({ 'required': true });
        }
      }
    });

    if (requiredFieldsError || !this.form.valid) {
      this.formError = true;
      this.error = STATUS.ALL_FIELDS_ARE_REQUIRED;
      return;
    }

    Object.keys(events).forEach(key => {
      let store_id;

      if (this.storeId) {
        store_id = this.storeId;
      }

      if (this.clubId) {
        store_id = this.clubId;
      }
      let _event = {
        title: events[key].title,
        store_id: store_id ? store_id : events[key].store_id,
        description: events[key].description,
        end: events[key].end,
        room: events[key].room,
        start: events[key].start,
        location: events[key].location,
        poster_url: events[key].poster_url,
        poster_thumb_url: events[key].poster_thumb_url,
        event_attendance: events[key].event_attendance
      };

      if (events[key].event_attendance === 1) {
        _event = Object.assign({}, _event, {
          event_feedback: events[key].event_feedback,
          event_manager_id: events[key].event_manager_id,
          attendance_manager_email: events[key].attendance_manager_email
        });
      }

      _events.push(_event);
    });

    this
      .eventsService
      .createEvent(_events)
      .subscribe(
      _ => {
        if (this.clubId) {
          this.router.navigate([`/manage/clubs/${this.clubId}/events`]);
        }

        if (this.serviceId) {
          this.router.navigate([`/manage/clubs/${this.serviceId}/events`]);
        }

        this.router.navigate(['/manage/events']);
      },
      err => {
        this.formError = true;

        if (err.status === 400) {
          this.error = STATUS.ALL_FIELDS_ARE_REQUIRED;
          return;
        }

        this.error = STATUS.SOMETHING_WENT_WRONG;
      }
      );
  }

  toggleSingleEventAttendance(checked, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_manager_id'].setValue(null);
    control.controls['event_attendance'].setValue(checked ? 1 : 0);
  }

  ngOnInit() {
    this
      .store
      .select('EVENTS_MODAL')
      .subscribe(
      res => {
        console.log('test');
        this.events = !isDev ? res : require('./mock.json');
        this.fetch();
      });

    this.eventAttendanceFeedback = [
      {
        'label': 'Enabled',
        'event': 1
      },
      {
        'label': 'Disabled',
        'event': 0
      }
    ];
  }
}
