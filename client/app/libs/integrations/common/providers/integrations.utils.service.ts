import { Injectable } from '@angular/core';

import { CPI18nService } from '@app/shared/services';
import { IItem } from '@shared/components/cp-dropdown';
import { FeedIntegration } from './../model/integration.model';
import { parseErrorResponse } from '@client/app/shared/utils/http';

export enum ReponseErrors {
  'duplicate_feed_url_in_school' = 'duplicate feed_url in school'
}
@Injectable()
export class CommonIntegrationUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  static typesDropdown(): IItem[] {
    return [
      {
        action: FeedIntegration.types.rss,
        label: 'RSS'
      },
      {
        action: FeedIntegration.types.atom,
        label: 'Atom'
      },
      {
        action: FeedIntegration.types.ical,
        label: 'iCal'
      }
    ];
  }

  handleCreateUpdateError(error: any): { error: string } {
    const errorMessage = parseErrorResponse(error);
    const defaultError = this.cpI18n.translate('something_went_wrong');
    const duplicateFeedError = this.cpI18n.translate(
      't_shared_integration_create_error_duplicate_feed_url'
    );

    const isDuplicateFeed = errorMessage === ReponseErrors.duplicate_feed_url_in_school;

    return {
      error: isDuplicateFeed ? duplicateFeedError : defaultError
    };
  }
}
