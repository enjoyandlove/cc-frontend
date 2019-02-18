import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';

import * as fromDining from '../actions';

import { IDining } from '@libs/locations/common/model';

export interface IDiningState extends EntityState<IDining> {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  ids: Array<number>;
  entities: Dictionary<IDining>;
}

const defaultDining: IDiningState = {
  ids: [],
  entities: {},
  error: false,
  loaded: false,
  loading: false
};

export const diningAdaptor: EntityAdapter<IDining> = createEntityAdapter<IDining>();

export const initialState: IDiningState = diningAdaptor.getInitialState(defaultDining);

export function reducer(state = initialState, action: fromDining.DiningAction) {
  switch (action.type) {
    case fromDining.diningActions.GET_DINING: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromDining.diningActions.GET_DINING_SUCCESS: {
      return diningAdaptor.addAll(action.payload, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });
    }

    case fromDining.diningActions.GET_DINING_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true
      };
    }

    case fromDining.diningActions.GET_DINING_BY_ID: {
      return {
        ...state,
        loading: true
      };
    }

    case fromDining.diningActions.GET_DINING_BY_ID_SUCCESS: {
      return diningAdaptor.upsertOne(action.payload, {
        ...state,
        error: false,
        loading: false
      });
    }

    case fromDining.diningActions.GET_DINING_BY_ID_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromDining.diningActions.POST_DINING: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case fromDining.diningActions.POST_DINING_SUCCESS: {
      return diningAdaptor.addOne(action.payload, {
        ...state,
        error: false,
        loading: false
      });
    }

    case fromDining.diningActions.POST_DINING_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromDining.diningActions.DELETE_DINING: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: true
      };
    }

    case fromDining.diningActions.DELETE_DINING_SUCCESS: {
      const deletedId = action.payload.deletedId;

      return diningAdaptor.removeOne(deletedId, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });
    }

    case fromDining.diningActions.DELETE_DINING_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromDining.diningActions.RESET_ERROR: {
      return {
        ...state,
        error: false
      };
    }

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities } = diningAdaptor.getSelectors();

export const getDining = selectAll;
export const getDiningEntities = selectEntities;
export const getDiningError = (state: IDiningState) => state.error;
export const getDiningLoaded = (state: IDiningState) => state.loaded;
export const getDiningLoading = (state: IDiningState) => state.loading;
