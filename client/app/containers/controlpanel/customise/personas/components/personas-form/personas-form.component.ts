import { PersonasType, PersonasLoginRequired } from './../../personas.status';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PersonasUtilsService } from '../../personas.utils.service';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-form',
  templateUrl: './personas-form.component.html',
  styleUrls: ['./personas-form.component.scss']
})
export class PersonasFormComponent implements OnInit {
  @Input() form: FormGroup;

  @Output() valueChanges: EventEmitter<FormGroup> = new EventEmitter();

  platformMenu;
  selectedPlatform = null;
  requiresCredentialsMenu;
  mobileType = PersonasType.mobile;
  selectedRequiresCredentials = null;
  loginRequired = PersonasLoginRequired.required;

  constructor(public cpI18n: CPI18nService, public utils: PersonasUtilsService) {}

  togglePretour(value) {
    this.form.controls['pretour_enabled'].setValue(value);
  }

  onPlatformChange({ id }) {
    this.form.controls['platform'].setValue(id);
  }

  onRequireCredentialsChange({ id }) {
    this.form.controls['login_requirement'].setValue(id);
  }

  setDefaultPlatform() {
    this.selectedPlatform = this.platformMenu.filter(
      (option) => option.id === this.form.value.platform
    )[0];
  }

  setDefaultRequiresCredentials() {
    this.selectedRequiresCredentials = this.requiresCredentialsMenu.filter(
      (option) => option.id === this.form.value.login_requirement
    )[0];
  }

  ngOnInit(): void {
    this.platformMenu = this.utils.plaftormMenu();
    this.requiresCredentialsMenu = this.utils.requiresCredentialsMenu();

    if (this.form.value.name) {
      this.setDefaultPlatform();
      this.setDefaultRequiresCredentials();
    }

    this.form.valueChanges.subscribe((_) => this.valueChanges.emit(this.form));
  }
}