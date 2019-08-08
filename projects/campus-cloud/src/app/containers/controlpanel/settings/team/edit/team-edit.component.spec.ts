import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TeamUtilsService } from '../team.utils.service';
import { TeamEditComponent } from './team-edit.component';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { AdminService, ErrorService } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

const privilegeSet = { r: true, w: true };

describe('TeamEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [provideMockStore(), TeamUtilsService, AdminService, ErrorService],
        declarations: [TeamEditComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let component: TeamEditComponent;
  let fixture: ComponentFixture<TeamEditComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEditComponent);
    component = fixture.componentInstance;
  });

  it('Should update services label dropdown', () => {
    component.schoolPrivileges = {
      [CP_PRIVILEGES_MAP.services]: privilegeSet
    };

    component.updateServiceDropdownLabel();

    expect(component.servicesCount.label).toEqual(component.cpI18n.translate('admin_all_services'));

    component.schoolPrivileges = {};
    component.accountPrivileges = {
      [578]: { [CP_PRIVILEGES_MAP.services]: privilegeSet }
    };

    component.updateServiceDropdownLabel();

    expect(component.servicesCount.label).toEqual(
      `${1} ${component.cpI18n.translate('admin_form_label_services')}`
    );

    component.schoolPrivileges = {};
    component.accountPrivileges = {};
    component.updateServiceDropdownLabel();

    expect(component.servicesCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
  });

  it('Should update clubs label dropdown', () => {
    component.schoolPrivileges = {
      [CP_PRIVILEGES_MAP.clubs]: privilegeSet
    };

    component.updateClubDropdownLabel();

    expect(component.clubsCount.label).toEqual(component.cpI18n.translate('admin_all_clubs'));

    component.schoolPrivileges = {};
    component.accountPrivileges = {
      [578]: { [CP_PRIVILEGES_MAP.clubs]: privilegeSet }
    };

    component.updateClubDropdownLabel();

    expect(component.clubsCount.label).toEqual(
      `${1} ${component.cpI18n.translate('admin_form_label_clubs')}`
    );

    component.schoolPrivileges = {};
    component.accountPrivileges = {};
    component.updateClubDropdownLabel();

    expect(component.clubsCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
  });

  it('Should update athletics label dropdown', () => {
    component.schoolPrivileges = {
      [CP_PRIVILEGES_MAP.athletics]: privilegeSet
    };

    component.updateAthleticDropdownLabel();

    expect(component.athleticsCount.label).toEqual(
      component.cpI18n.translate('admin_all_athletics')
    );

    component.schoolPrivileges = {};
    component.accountPrivileges = {
      [578]: { [CP_PRIVILEGES_MAP.athletics]: privilegeSet }
    };

    component.updateAthleticDropdownLabel();

    expect(component.athleticsCount.label).toEqual(
      `${1} ${component.cpI18n.translate('admin_form_label_athletics')}`
    );

    component.schoolPrivileges = {};
    component.accountPrivileges = {};
    component.updateAthleticDropdownLabel();

    expect(component.athleticsCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
  });
});
