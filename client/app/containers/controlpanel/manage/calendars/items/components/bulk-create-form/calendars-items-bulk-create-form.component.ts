import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms/src/model';

import { CPSession } from '../../../../../../../session';

@Component({
  selector: 'cp-calendars-items-bulk-create-form',
  templateUrl: './calendars-items-bulk-create-form.component.html',
  styleUrls: ['./calendars-items-bulk-create-form.component.scss']
})
export class CalendarsItemsBulkCreateFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  buttonData;

  constructor(public session: CPSession) {}

  onSubmit() {
    this.submitted.emit(this.form.value);
    this.enableSubmitButton();
  }

  onResetMap(index) {
    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['location'].setValue('');
    control.controls['latitude'].setValue(0);
    control.controls['longitude'].setValue(0);
  }

  updateWithUserLocation(location, index) {
    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['location'].setValue(location.name);
    control.controls['latitude'].setValue(location.latitude);
    control.controls['longitude'].setValue(location.longitude);
  }

  onPlaceChange(placeData, index) {
    if (!placeData) {
      return;
    }

    if ('fromUsersLocations' in placeData) {
      this.updateWithUserLocation(placeData, index);

      return;
    }

    const coords: google.maps.LatLngLiteral = placeData.geometry.location.toJSON();

    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['latitude'].setValue(coords.lat);
    control.controls['longitude'].setValue(coords.lng);

    control.controls['location'].setValue(placeData.name);
  }

  enableSubmitButton() {
    this.buttonData = { ...this.buttonData, disabled: false };
  }

  ngOnInit() {
    this.buttonData = {
      text: 'Import Items',
      class: 'primary'
    };

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
