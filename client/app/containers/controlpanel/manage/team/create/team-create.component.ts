import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '../../../../../session';
import { STATUS } from '../../../../../shared/constants';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { ErrorService, AdminService } from '../../../../../shared/services';
import { CP_PRIVILEGES, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

const eventsDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'No Access',
      'action': null
    },
    {
      'label': 'Manage Events',
      'action': 2
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Manage and Assess Events',
        'action': 3
      }
    ];
  }
  return items;
};

const manageAdminDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'Disabled',
      'action': null
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Enabled',
        'action': 1
      }
    ];
  }
  return items;
};

const clubsDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'No Access',
      'action': null
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Select Clubs',
        'action': 2
      },
      {
        'label': 'All Clubs',
        'action': 3
      },
    ];
  }
  return items;
};

const servicesDropdown = function (privilege: { r: boolean, w: boolean }) {
  let items = [
    {
      'label': 'No Access',
      'action': null
    }
  ];

  if (privilege.w) {
    items = [
      ...items,
      {
        'label': 'Select Services',
        'action': 2
      },
      {
        'label': 'All Services',
        'action': 3
      },
    ];
  }
  return items;
};


declare var $: any;

@Component({
  selector: 'cp-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  user;
  formData;
  schoolId;
  formError;
  clubsMenu;
  eventsMenu;
  isFormError;
  canReadClubs;
  manageAdmins;
  servicesMenu;
  isClubsModal;
  canReadEvents;
  isServiceModal;
  canReadServices;
  form: FormGroup;
  accountPrivileges;
  isAllAccessEnabled;
  schoolPrivileges = {};
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;
  CP_PRIVILEGES_MAP = CP_PRIVILEGES_MAP;

  resetClubsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetServiceModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private teamService: AdminService,
    private errorService: ErrorService
  ) { }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'email': [null, Validators.required]
    });
  }

  onSubmit(data) {
    this.formError = null;
    this.isFormError = false;

    if (!this.form.valid) {
      this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }

    let _data = {
      ...data,
      school_level_privileges: {
        [this.schoolId]: {
          ...this.schoolPrivileges
        }
      },
      account_level_privileges: {
        ...this.accountPrivileges
      }
    };

    const isEmpty = require('lodash').isEmpty;
    const emptyAccountPrivileges = isEmpty(_data.account_level_privileges);
    const emptySchoolPrivileges = isEmpty(_data.school_level_privileges[this.schoolId]);

    if (emptyAccountPrivileges && emptySchoolPrivileges) {
      this.formError = 'You have not granted any access';
      this.isFormError = true;
      return;
    }

    this
      .teamService
      .createAdmin(_data)
      .subscribe(
      _ => this.router.navigate(['/manage/team']),
      err => {
        this.isFormError = true;

        if (err.status === 409) {
          this.formError = STATUS.DUPLICATE_ENTRY;
          return;
        }

        this.formError = STATUS.SOMETHING_WENT_WRONG;
      }
      );
  }

  onManageAdminSelected(data) {
    if (!data.action) {
      if (CP_PRIVILEGES_MAP.manage_admin in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
      }
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.manage_admin]: {
          r: true,
          w: true
        }
      }
    );
  }

  toggleAllAccess(checked) {
    if (checked) {
      this.accountPrivileges = Object.assign(
        {},
        this.user.account_level_privileges
      );

      this.schoolPrivileges = Object.assign(
        {},
        this.user.school_level_privileges[this.schoolId]
      );
      return;
    }

    this.accountPrivileges = {};
    this.schoolPrivileges = {};
  }

  onServicesModalSelected(services) {
    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...services
    );
  }

  onServicesSelected(service) {
    this.doServicesCleanUp();

    if (service.action === 2) {
      this.isServiceModal = true;

      setTimeout(() => { $('#selectServicesModal').modal(); }, 1);
      return;
    }

    if (service.action === null) {
      this.resetServiceModal$.next(true);

      if (this.accountPrivileges) {
        if (CP_PRIVILEGES_MAP.services in this.accountPrivileges) {
          delete this.accountPrivileges[CP_PRIVILEGES_MAP.services];
        }
      }
      return;
    }

    this.resetServiceModal$.next(true);

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.services]: {
          r: service.action === 2 ? true : true,
          w: service.action === 2 ? false : true
        }
      }
    );
  }

  onClubsModalSelected(clubs) {
    this.accountPrivileges = Object.assign(
      {},
      this.accountPrivileges,
      ...clubs
    );
  }

  doClubsCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.clubs);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.membership);
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.moderation);
  }

  doServicesCleanUp() {
    accountCleanUp(this.accountPrivileges, CP_PRIVILEGES_MAP.services);
  }

  onClubsSelected(club) {
    this.doClubsCleanUp();

    if (club.action === 2) {
      this.isClubsModal = true;
      setTimeout(() => { $('#selectClubsModal').modal() }, 1);
      return;
    }

    if (club.action === null) {
      this.resetClubsModal$.next(true);

      if (CP_PRIVILEGES_MAP.clubs in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.clubs];
      }
      if (CP_PRIVILEGES_MAP.membership in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.membership];
      }
      if (CP_PRIVILEGES_MAP.moderation in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.moderation];
      }

      return;
    }

    this.resetClubsModal$.next(true);

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w: this.session.user.school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        },

        [CP_PRIVILEGES_MAP.moderation]: {
          r: true,
          w: this.session.user.school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        },

        [CP_PRIVILEGES_MAP.membership]: {
          r: true,
          w: this.session.user.school_level_privileges[this.schoolId][CP_PRIVILEGES_MAP.clubs].w
        }
      }
    );
  }

  onEventsSelected(event) {
    if (event.action === null) {
      if (CP_PRIVILEGES_MAP.events in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.events];
      }
      return;
    }

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [CP_PRIVILEGES_MAP.events]: {
          r: event.action === 2 ? true : true,
          w: event.action === 2 ? false : true
        }
      }
    );
  }

  handleDependencies(privilegeNo, dependencies: Array<number>) {
    if (!dependencies.length) { return; }

    dependencies.map(dep => {

      if (this.schoolPrivileges[dep]) {
        return;
      }

      if (this.schoolPrivileges[privilegeNo]) {
        this.checkControl(undefined, dep, { deps: [] });
      }

    });
  }

  disableDependencies(deps: Array<number>) {
    deps.map(dep => {
      if (this.schoolPrivileges && this.schoolPrivileges[dep]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }


  checkControl(isChecked, privilegeNo, privilegeExtraData): void {
    if (!isChecked && privilegeExtraData.disables) {
      this.disableDependencies(privilegeExtraData.disables);
    }

    if (this.schoolPrivileges && this.schoolPrivileges[privilegeNo]) {
      delete this.schoolPrivileges[privilegeNo];
      this.handleDependencies(privilegeNo, privilegeExtraData.deps);
      return;
    }

    let privilege = this.user.school_level_privileges[this.schoolId][privilegeNo];

    this.schoolPrivileges = Object.assign(
      {},
      this.schoolPrivileges,
      {
        [privilegeNo]: {
          r: privilege.r,
          w: privilege.w
        }
      });

    this.handleDependencies(privilegeNo, privilegeExtraData.deps);
  }

  ngOnInit() {
    const { school_level_privileges } = this.session.user;
    const schoolPrivileges = school_level_privileges[this.session.school.id];
    this.user = this.session.user;
    this.schoolId = this.session.school.id;


    this.canReadClubs = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.clubs) ||
      this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.clubs);

    this.canReadEvents = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.events);

    this.canReadServices = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.services) ||
      this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.services);

    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();
    this.buildForm();

    const clubsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.clubs];
    const eventsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.events];
    const servicesPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.services];
    const manageAdminPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

    this.clubsMenu = clubsDropdown(clubsPrivilege);
    this.eventsMenu = eventsDropdown(eventsPrivilege);
    this.servicesMenu = servicesDropdown(servicesPrivilege);
    this.manageAdmins = manageAdminDropdown(manageAdminPrivilege);

  }
}

function accountCleanUp(accountPrivileges, privilegeNo: number) {
  if (accountPrivileges) {
    Object.keys(accountPrivileges).map(store => {
      if (privilegeNo in accountPrivileges[store]) {
        delete accountPrivileges[store][privilegeNo]
      }
    })
  }
  return accountPrivileges;
}
