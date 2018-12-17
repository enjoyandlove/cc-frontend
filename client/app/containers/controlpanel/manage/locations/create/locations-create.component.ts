import { FormControl, FormGroup } from '@angular/forms';
import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { LocationModel } from '../model';
import { baseActions } from '@app/store/base';
import { CPSession, ISchool } from '@app/session';
import { CPI18nService } from '@app/shared/services';
import { LocationsService } from '../locations.service';
import { LocationsUtilsService } from '../locations.utils';

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit {
  formErrors;
  buttonData;
  errorMessage;
  school: ISchool;
  openingHours = true;
  buttonDisabled = false;
  locationForm: FormGroup;

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: LocationsService,
    public utils: LocationsUtilsService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>
  ) {}

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

    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      body,
      params
    };

    this.store.dispatch(new fromStore.PostLocation(payload));
  }

  buildHeader() {
    const payload = {
      heading: 't_locations_create_location',
      subheading: null,
      em: null,
      children: []
    };

    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload
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

    this.locationForm = LocationModel.form();
    this.utils.setScheduleFormControls(this.locationForm);
    this.locationForm.get('latitude').setValue(this.school.latitude);
    this.locationForm.get('longitude').setValue(this.school.longitude);
  }
}
