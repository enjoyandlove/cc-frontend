import { OnInit, Component, OnDestroy } from '@angular/core';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { baseActions } from '@app/store/base';
import { LocationModel, ILocation } from '../model';
import { CPI18nService } from '@app/shared/services';
import { LocationsUtilsService } from '../locations.utils';

@Component({
  selector: 'cp-locations-edit',
  templateUrl: './locations-edit.component.html',
  styleUrls: ['./locations-edit.component.scss']
})
export class LocationsEditComponent extends BaseComponent implements OnInit, OnDestroy {
  school;
  loading$;
  formErrors;
  locationId;
  errorMessage;
  openingHours = false;
  buttonDisabled = false;
  locationForm: FormGroup;

  private destroy$ = new Subject();

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>,
  ) {
    super();
  }

  doSubmit() {
    this.formErrors = false;
    this.buttonDisabled = true;

    if (!this.locationForm.valid) {
      this.formErrors = true;
      this.buttonDisabled = false;

      this.handleWarning();

      return;
    }

    const body = this.locationForm.value;
    body['schedule'] = LocationsUtilsService.filteredScheduleControls(this.locationForm, this.openingHours);

    const locationId = this.locationId;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      body,
      params,
      locationId
    };

    this.store.dispatch(new fromStore.EditLocation(payload));
  }

  buildHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: `t_locations_edit_location`,
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  setErrors() {
    this.store.select(fromStore.getLocationsEditError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          this.formErrors = true;
          this.buttonDisabled = false;
          const errorMessage = this.cpI18n.translate('something_went_wrong');

          this.handleError(errorMessage);
        })
      )
      .subscribe();
  }

  onCancel() {
    this.router.navigate(['/manage/locations']);
  }

  handleError(body) {
    const options = {
      body,
      class: 'danger'
    };
    this.dispatchSnackBar(options);
  }

  handleWarning() {
    const options = {
      class: 'warning',
      body: this.cpI18n.translate('error_fill_out_marked_fields')
    };

    this.dispatchSnackBar(options);
  }

  dispatchSnackBar(options) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        ...options,
        sticky: true,
        autoClose: true
      }
    });
  }

  ngOnInit() {
    this.setErrors();
    this.buildHeader();
    this.school = this.session.g.get('school');
    this.loading$ = this.store.select(fromStore.getLocationsLoading);
    this.store.select(fromStore.getSelectedLocation)
      .subscribe((location: ILocation) => {
        if (location) {
          const schedule = location['schedule'];
          this.openingHours = !!schedule.length;
          this.locationId = location.id;
          this.locationForm = LocationModel.form(location);
          LocationsUtilsService.setScheduleFormControls(this.locationForm, schedule);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
