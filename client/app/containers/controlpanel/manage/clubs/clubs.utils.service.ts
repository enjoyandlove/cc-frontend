import { Injectable } from '@angular/core';

import { IClub } from './club.interface';
import { ClubStatus } from './club.status';
import { CP_PRIVILEGES_MAP } from './../../../../shared/constants/privileges';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../shared/utils/privileges/privileges';

@Injectable()
export class ClubsUtilsService {
  getSubNavChildren(club: IClub, session) {
    let links = [];

    const clubIsActive = club.status === ClubStatus.active;

    const clubIsPending = club.status !== ClubStatus.pending;

    const schoolAccess = (permission) => canSchoolReadResource(session.g, permission);

    const storeAccess = (permission) => {
      return canStoreReadAndWriteResource(session.g, club.id, permission);
    }

    const schoolOrStoreAccess = (permission) => schoolAccess(permission) || storeAccess(permission);

    if (clubIsActive && schoolOrStoreAccess(CP_PRIVILEGES_MAP.events)) {
      links = ['Events', ...links];
    }

    if (club.has_membership) {
      if (clubIsPending && schoolOrStoreAccess(CP_PRIVILEGES_MAP.moderation)) {
        links = ['Wall', ...links];
      }

      if (schoolOrStoreAccess(CP_PRIVILEGES_MAP.membership)) {
        links = ['Members', ...links];
      }
    }

    links = ['Info', ...links];

    return links
  }
}
