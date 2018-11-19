import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';
import { CP_PRIVILEGES_MAP } from './../shared/constants/privileges';
import { canSchoolWriteResource } from './../shared/utils/privileges/privileges';
/**
 * All session data should be set
 * as part of the g (global) Map
 */

export * from './user.interface';
export * from './school.interface';

@Injectable()
export class CPSession {
  /**
   * GLOBAL, we store the School(s), User and any other
   * object that is referenced throughout the application
   */
  public g = new Map();
  private _defaultHost = null;

  get tz() {
    const schoolTimeZone = _get(this.g.get('school'), 'tz_zoneinfo_str', null);

    return schoolTimeZone ? schoolTimeZone : 'America/Toronto';
  }

  get isSuperAdmin() {
    const clubsSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.clubs);
    const assessSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.assessment);
    const serviceSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.services);
    const moderationSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.moderation);

    const eventSchoolWide = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.events);
    const manageAndAssessEvent = canSchoolWriteResource(this.g, CP_PRIVILEGES_MAP.event_attendance);

    return (
      clubsSchoolWide &&
      assessSchoolWide &&
      serviceSchoolWide &&
      manageAndAssessEvent &&
      eventSchoolWide &&
      moderationSchoolWide
    );
  }

  get hasSSO() {
    return _get(this.g.get('school'), 'has_sso_integration', false);
  }

  set defaultHost(storeId) {
    this._defaultHost = storeId;
  }

  get defaultHost() {
    return this._defaultHost;
  }

  get isInternal() {
    const email = _get(this.g.get('user'), 'email', '').toLocaleLowerCase();

    return (
      email.endsWith('@oohlalamobile.com') ||
      email.endsWith('@dublabs.com') ||
      email.endsWith('@readyeducation.com')
    );
  }

  get school() {
    return this.g.get('school');
  }

  get user() {
    return this.g.get('user');
  }
  constructor() {}

  canAttendance(storeId = null) {
    const schoolPrivilges = _get(this.user, ['school_level_privileges', this.school.id], {});
    const schoolAccess = _get(schoolPrivilges, CP_PRIVILEGES_MAP.event_attendance, false);

    const accountPrivileges = _get(this.user, ['account_level_privileges', storeId], {});
    const accountAccess = _get(accountPrivileges, CP_PRIVILEGES_MAP.event_attendance, false);

    return schoolAccess || accountAccess;
  }

  get hasGuideCustomization() {
    return _get(this.g.get('school'), 'has_guide_customization', false);
  }
}
