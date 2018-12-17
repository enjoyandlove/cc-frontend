import { FormControl, FormGroup } from '@angular/forms';
import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { baseActions } from '@app/store/base';
import { LocationModel, ILocation } from '../model';
import { CPI18nService } from '@app/shared/services';
import { LocationsUtilsService } from '../locations.utils';

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss']
})
export class LocationsUpdateComponent extends BaseComponent implements OnInit {
  school;
  loading$;
  formErrors;
  buttonData;
  locationId;
  errorMessage;
  openingHours = false;
  buttonDisabled = false;
  locationForm: FormGroup;

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: LocationsUtilsService,
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

      this.handleError();

      return;
    }

    if (!this.openingHours) {
      this.locationForm.setControl('schedule', new FormControl([]));
    }

    const body = this.locationForm.value;
    body['schedule'] = this.utils.filteredScheduleControls(this.locationForm);

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
    this.store.select(fromStore.getLocationsError)
      .subscribe((isError: boolean) => {
        if (isError) {
          this.formErrors = true;
          this.buttonDisabled = false;
          const errorMessage = this.cpI18n.translate('something_went_wrong');

          this.handleError(errorMessage);
        }
      });
  }

  onCancel() {
    this.router.navigate(['/manage/locations']);
  }

  handleError(err?: string) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        autoClose: true,
        body: err ? err : this.cpI18n.translate('error_fill_out_marked_fields')
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
          this.utils.setScheduleFormControls(this.locationForm, schedule);
        }
      });
  }
}
