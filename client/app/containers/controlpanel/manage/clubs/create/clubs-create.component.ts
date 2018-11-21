import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ClubStatus } from '../club.status';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { baseActions } from '../../../../../store/base';
import { ClubsUtilsService } from '../clubs.utils.service';
import { membershipTypes, statusTypes } from './permissions';
import { CPTrackingService } from '../../../../../shared/services';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { clubAthleticLabels, isClubAthletic } from '../clubs.athletics.labels';

@Component({
  selector: 'cp-clubs-create',
  templateUrl: './clubs-create.component.html',
  styleUrls: ['./clubs-create.component.scss']
})
export class ClubsCreateComponent implements OnInit {
  @Input() isAthletic = isClubAthletic.club;

  labels;
  school;
  formError;
  buttonData;
  form: FormGroup;
  statusTypes = statusTypes;
  showLocationDetails = false;
  mapCenter: BehaviorSubject<any>;
  membershipTypes = membershipTypes;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);

  eventProperties = {
    phone: null,
    email: null,
    website: null,
    club_id: null,
    location: null,
    club_type: null,
    club_status: null,
    membership_status: null
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public store: Store<any>,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: ClubsUtilsService,
    public clubsService: ClubsService,
    public cpTracking: CPTrackingService
  ) {}

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id.toString())
      .append('category_id', this.isAthletic.toString());

    this.clubsService.createClub(this.form.value, search).subscribe(
      (res: any) => {
        this.trackEvent(res);
        this.router.navigate(['/manage/' + this.labels.club_athletic + '/' + res.id + '/info']);
      },
      (err) => {
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
        throw new Error(err);
      }
    );
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data, this.labels.club_athletic)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CREATED_CLUB, this.eventProperties);
  }

  onUploadedImage(image): void {
    this.form.controls['logo_url'].setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  onSelectedMembership(type): void {
    this.form.controls['has_membership'].setValue(type.action);

    this.eventProperties = {
      ...this.eventProperties,
      membership_status: type.label
    };
  }

  onSelectedStatus(type): void {
    this.form.controls['status'].setValue(type.action);

    this.eventProperties = {
      ...this.eventProperties,
      club_status: type.label
    };
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_info'].setValue(null);
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    this.drawMarker.next(true);

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);

      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.name };

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onLocationToggle(value) {
    this.showLocationDetails = value;

    if (!value) {
      this.drawMarker.next(false);

      this.mapCenter = new BehaviorSubject({
        lat: this.school.latitude,
        lng: this.school.longitude
      });

      this.form.controls['room_info'].setValue(null);
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    }
  }

  ngOnInit() {
    this.eventProperties = {
      ...this.eventProperties,
      club_status: this.statusTypes[0].label,
      membership_status: this.membershipTypes[0].label
    };

    this.labels = clubAthleticLabels(this.isAthletic);

    this.school = this.session.g.get('school');

    this.mapCenter = new BehaviorSubject({
      lat: this.school.latitude,
      lng: this.school.longitude
    });

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: this.labels.create_button,
        subheading: null,
        em: null,
        children: []
      }
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate(this.labels.create_button)
    };

    this.form = this.fb.group({
      name: [null, Validators.required],
      logo_url: [null, Validators.required],
      status: [ClubStatus.active, Validators.required],
      has_membership: [true, Validators.required],
      location: [null],
      address: [null],
      city: [null],
      country: [null],
      postal_code: [null],
      province: [null],
      latitude: [0],
      longitude: [0],
      room_info: [null],
      description: [null],
      website: [null],
      phone: [null],
      email: [null],
      category_id: this.isAthletic
    });
  }
}
