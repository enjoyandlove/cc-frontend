import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { ClubsService } from '../clubs.service';
import { membershipTypes, statusTypes } from '../create/permissions';

import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { ClubsUtilsService } from './../clubs.utils.service';
import { advisorDataRequired } from './custom-validators.directive';

@Component({
  selector: 'cp-clubs-edit',
  templateUrl: './clubs-edit.component.html',
  styleUrls: ['./clubs-edit.component.scss'],
})
export class ClubsEditComponent extends BaseComponent implements OnInit {
  club;
  school;
  clubId;
  loading;
  formError;
  buttonData;
  statusTypes;
  defaultStatus;
  membershipTypes;
  form: FormGroup;
  isSJSU: boolean;
  defaultMembership;
  isFormReady = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private helper: ClubsUtilsService,
    private clubsService: ClubsService,
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.clubId = this.route.snapshot.params['clubId'];
  }

  getDefaultStatus(value) {
    return this.statusTypes.filter((status) => status.action === value)[0];
  }

  getDefaultMembership(value) {
    return this.membershipTypes.filter(
      (membership) => membership.action === value,
    )[0];
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.clubsService.getClubById(this.clubId, search);

    super
      .fetchData(stream$)
      .then((res) => {
        this.club = res.data;

        this.isSJSU = this.helper.isSJSU(this.club);

        this.buildForm();

        this.defaultStatus = this.getDefaultStatus(this.club.status);

        this.defaultMembership = this.getDefaultMembership(
          this.club.has_membership,
        );

        this.mapCenter = new BehaviorSubject({
          lat: res.data.latitude,
          lng: res.data.longitude,
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.club.name, Validators.required],
      logo_url: [this.club.logo_url, Validators.required],
      status: [this.club.status, Validators.required],
      has_membership: [this.club.has_membership, Validators.required],
      location: [this.club.location],
      address: [this.club.address],
      city: [this.club.city],
      country: [this.club.country],
      postal_code: [this.club.postal_code],
      province: [this.club.province],
      latitude: [this.club.latitude],
      longitude: [this.club.longitude],
      room_info: [this.club.room_info],
      description: [this.club.description],
      website: [this.club.website],
      phone: [this.club.phone],
      email: [this.club.email],
      advisor_firstname: [
        this.club.advisor_firstname,
        advisorDataRequired(this.isSJSU),
      ],
      advisor_lastname: [
        this.club.advisor_lastname,
        advisorDataRequired(this.isSJSU),
      ],
      advisor_email: [
        this.club.advisor_email,
        advisorDataRequired(this.isSJSU),
      ],
    });

    this.isFormReady = true;
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    const search = new URLSearchParams();

    search.append('school_id', this.session.g.get('school').id.toString());

    this.clubsService
      .updateClub(this.form.value, this.clubId, search)
      .subscribe(
        (res) => {
          this.router.navigate(['/manage/clubs/' + res.id + '/info']);
        },
        (err) => {
          this.buttonData = Object.assign({}, this.buttonData, {
            disabled: false,
          });
          throw new Error(err);
        },
      );
  }

  onUploadedImage(image): void {
    this.form.controls['logo_url'].setValue(image);
  }

  onSelectedMembership(type) {
    this.form.controls['has_membership'].setValue(type.action);
  }

  onSelectedStatus(type) {
    this.form.controls['status'].setValue(type.action);
  }

  onResetMap() {
    CPMap.setFormLocationData(
      this.form,
      CPMap.resetLocationFields(this.school),
    );
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

  ngOnInit() {
    this.fetch();
    this.school = this.session.g.get('school');

    this.buttonData = {
      text: this.cpI18n.translate('save'),
      class: 'primary',
    };

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'clubs_edit_heading',
        subheading: null,
        em: null,
        children: [],
      },
    });

    this.statusTypes = statusTypes;
    this.membershipTypes = membershipTypes;
  }
}