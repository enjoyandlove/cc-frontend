import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

import { IStore } from '@shared/services/store.service';
import { IEventIntegration } from '@libs/integrations/events/model/event-integration.interface';

export enum IntegrationActions {
  DESTROY = '[manage.calendars.items.integrations] destroy',

  GET_INTEGRATIONS = '[manage.calendars.items.integrations] get integrations',
  GET_INTEGRATIONS_SUCCESS = '[manage.calendars.items.integrations] get integrations success',
  GET_INTEGRATIONS_FAIL = '[manage.calendars.items.integrations] get integrations fail',

  POST_INTEGRATION = '[manage.calendars.items.integrations] post integration',
  POST_INTEGRATION_SUCCESS = '[manage.calendars.items.integrations] post integration success',
  POST_INTEGRATION_FAIL = '[manage.calendars.items.integrations] post integration fail',

  DELETE_INTEGRATION = '[manage.calendars.items.integrations] delete integration',
  DELETE_INTEGRATION_SUCCESS = '[manage.calendars.items.integrations] delete integration success',
  DELETE_INTEGRATION_FAIL = '[manage.calendars.items.integrations] delete integration fail',

  EDIT_INTEGRATION = '[manage.calendars.items.integrations] edit integration',
  EDIT_INTEGRATION_SUCCESS = '[manage.calendars.items.integrations] edit integration success',
  EDIT_INTEGRATION_FAIL = '[manage.calendars.items.integrations] edit integration fail',

  GET_HOSTS = '[manage.calendars.items.integrations] get hosts',
  GET_HOSTS_SUCCESS = '[manage.calendars.items.integrations] get hosts success',
  GET_HOSTS_FAIL = '[manage.calendars.items.integrations] get hosts fail'
}

export class GetIntegrations implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS;

  constructor(public payload: { startRange: number; endRange: number; params: HttpParams }) {}
}

export class GetIntegrationsSuccess implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_SUCCESS;

  constructor(public payload: IEventIntegration[]) {}
}

export class GetIntegrationsFail implements Action {
  readonly type = IntegrationActions.GET_INTEGRATIONS_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class PostIntegration implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION;

  constructor(public payload: { body: IEventIntegration; params: HttpParams }) {}
}

export class PostIntegrationSuccess implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_SUCCESS;

  constructor(public payload: IEventIntegration) {}
}

export class PostIntegrationFail implements Action {
  readonly type = IntegrationActions.POST_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteIntegration implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION;

  constructor(public payload: { integrationId: number; params: HttpParams }) {}
}

export class DeleteIntegrationSuccess implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION_SUCCESS;

  constructor(public payload: { deletedId: number }) {}
}

export class DeleteIntegrationFail implements Action {
  readonly type = IntegrationActions.DELETE_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class EditIntegration implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION;

  constructor(
    public payload: { integrationId: number; body: IEventIntegration; params: HttpParams }
  ) {}
}

export class EditIntegrationSuccess implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_SUCCESS;

  constructor(public payload: IEventIntegration) {}
}

export class EditIntegrationFail implements Action {
  readonly type = IntegrationActions.EDIT_INTEGRATION_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class GetHosts implements Action {
  readonly type = IntegrationActions.GET_HOSTS;

  constructor(public payload: { params: HttpParams }) {}
}

export class GetHostsSuccess implements Action {
  readonly type = IntegrationActions.GET_HOSTS_SUCCESS;

  constructor(public payload: IStore[]) {}
}

export class GetHostsFail implements Action {
  readonly type = IntegrationActions.GET_HOSTS_FAIL;

  constructor(public payload: HttpErrorResponse) {}
}

export class Destroy implements Action {
  readonly type = IntegrationActions.DESTROY;
}

export type Actions =
  | Destroy
  | GetIntegrations
  | GetIntegrationsSuccess
  | GetIntegrationsFail
  | PostIntegration
  | PostIntegrationSuccess
  | PostIntegrationFail
  | DeleteIntegration
  | DeleteIntegrationSuccess
  | DeleteIntegrationFail
  | EditIntegration
  | EditIntegrationSuccess
  | EditIntegrationFail
  | GetHosts
  | GetHostsSuccess
  | GetHostsFail;