import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CPMap } from '@shared/utils';
import { CPSession, ISchool } from '@app/session';

@Component({
  selector: 'cp-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {
  @Input() categories$;
  @Input() selectedCategory;
  @Input() formErrors: boolean;
  @Input() locationForm: FormGroup;

  school: ISchool;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  constructor(private session: CPSession) {}


  onResetMap() {
    CPMap.setFormLocationData(this.locationForm, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
    this.locationForm.get('latitude').setValue(this.school.latitude);
    this.locationForm.get('longitude').setValue(this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.locationForm, location);

    this.newAddress.next(this.locationForm.get('address').value);
  }

  updateWithUserLocation(location) {
    location = {
      ...location,
      location: location.name
    };

    CPMap.setFormLocationData(this.locationForm, location);

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

    CPMap.setFormLocationData(this.locationForm, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onSelectedCategory(category) {
    this.locationForm.get('category_id').setValue(category.value);
  }

  onUploadedImage(image) {
    this.locationForm.get('image_url').setValue(image);
  }

  get requiredControls() {
    return {
      name: this.locationForm.get('name'),
      latitude: this.locationForm.get('latitude'),
      longitude: this.locationForm.get('longitude'),
      category: this.locationForm.get('category_id'),
    };
  }

  ngOnInit(): void {
    this.school = this.session.g.get('school');
    const lat = this.locationForm.get('latitude').value;
    const lng = this.locationForm.get('longitude').value;

    this.mapCenter = new BehaviorSubject({
      lat: lat ? lat : this.school.latitude,
      lng: lng ? lng : this.school.longitude
    });
  }
}
