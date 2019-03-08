import { map, mergeMap, filter, catchError, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../';
import { ISnackbar } from '@app/store';
import { CPSession } from '@app/session';
import * as fromActions from '../actions';
import * as fromDining from '../../../store';
import { CPI18nService } from '@shared/services';
import { baseActionClass } from '@app/store/base';
import { IDining } from '@libs/locations/common/model';
import { LocationType } from '@libs/locations/common/utils';
import { ICategory } from '@libs/locations/common/categories/model';
import { DiningCategoriesService } from '../../dining-categories.service';
import {
  ICategoriesApiQuery,
  LocationCategoryLocale
} from '@libs/locations/common/categories/categories.status';

@Injectable()
export class DiningCategoriesEffects {
  constructor(
    public actions$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: DiningCategoriesService,
    public store: Store<fromDining.IDiningState | ISnackbar>
  ) {}

  @Effect()
  getCategories$: Observable<
    fromActions.GetCategoriesSuccess | fromActions.GetCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_CATEGORIES),
    mergeMap(() => {
      const search = this.getCategoryParams();

      return this.service.getCategories(search).pipe(
        map((data: ICategory[]) => new fromActions.GetCategoriesSuccess(data)),
        catchError((error) => {
          this.handleError();

          return of(new fromActions.GetCategoriesFail(error));
        })
      );
    })
  );

  @Effect()
  getCategoriesTypes$: Observable<
    fromActions.GetCategoriesTypeSuccess | fromActions.GetCategoriesTypeFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_CATEGORIES_TYPE),
    mergeMap(() => {
      const search = this.getCategoryParams();

      return this.service.getCategoriesType(search).pipe(
        map((data) => new fromActions.GetCategoriesTypeSuccess(data)),
        catchError((error) => {
          this.handleError();

          return of(new fromActions.GetCategoriesTypeFail(error));
        })
      );
    })
  );

  @Effect()
  createCategory$: Observable<
    fromActions.PostCategorySuccess | fromActions.PostCategoryFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.POST_CATEGORY),
    mergeMap((action: fromActions.PostCategory) => {
      const { body, params } = action.payload;

      return this.service.createCategory(body, params).pipe(
        map((data: ICategory) => {
          this.handleSuccess('t_category_successfully_created');

          return new fromActions.PostCategorySuccess(data);
        }),
        catchError((error) => {
          this.handleError();

          return of(new fromActions.PostCategoryFail(error));
        })
      );
    })
  );

  @Effect()
  getFilteredCategories$: Observable<
    fromActions.GetFilteredCategoriesSuccess | fromActions.GetFilteredCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_FILTERED_CATEGORIES),
    withLatestFrom(this.store.select(fromStore.getCategoriesParamState)),
    mergeMap(([_, params]) => {
      const search = this.getCategoryParams(params);

      return this.service.getCategories(search).pipe(
        map((data: ICategory[]) => new fromActions.GetFilteredCategoriesSuccess(data)),
        catchError((error) => {
          this.handleError();

          return of(new fromActions.GetFilteredCategoriesFail(error));
        })
      );
    })
  );

  @Effect()
  editCategory$: Observable<
    fromActions.EditCategorySuccess | fromActions.EditCategoryFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.EDIT_CATEGORY),
    mergeMap((action: fromActions.EditCategory) => {
      const { body, categoryId } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.updateCategory(body, categoryId, params).pipe(
        map((data: ICategory) => {
          this.handleSuccess('t_category_successfully_edited');

          return new fromActions.EditCategorySuccess(data);
        }),
        catchError(() => {
          this.handleError();

          return of(new fromActions.EditCategoryFail());
        })
      );
    })
  );

  @Effect()
  editCategorySuccess$: Observable<fromDining.GetDiningSuccess> = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.EDIT_CATEGORY_SUCCESS),
    map((action: fromActions.EditCategorySuccess) => action.payload),
    withLatestFrom(this.store.select(fromDining.getDining)),
    map(([{ id, name, img_url, color }, dining]) => {
      return dining.map((d: IDining) => {
        if (d.category_id === id) {
          return {
            ...d,
            category_name: name,
            category_color: color,
            category_img_url: img_url
          };
        }
        return d;
      });
    }),
    filter((d: IDining[]) => !!d.length),
    mergeMap((d: IDining[]) => of(new fromDining.GetDiningSuccess(d)))
  );

  @Effect()
  deleteCategory$: Observable<
    fromActions.DeleteCategoriesSuccess | fromActions.DeleteCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.DELETE_CATEGORIES),
    mergeMap((action: fromActions.DeleteCategories) => {
      const { categoryId } = action.payload;
      const params = new HttpParams().set('school_id', this.session.g.get('school').id);

      return this.service.deleteCategoryById(categoryId, params).pipe(
        map(() => {
          this.handleSuccess('t_category_successfully_deleted');

          return new fromActions.DeleteCategoriesSuccess({ deletedId: categoryId });
        }),
        catchError(() => {
          this.handleError();

          return of(new fromActions.DeleteCategoriesFail());
        })
      );
    })
  );

  private getCategoryParams(state?: ICategoriesApiQuery) {
    const locale = CPI18nService.getLocale().startsWith('fr')
      ? LocationCategoryLocale.fr
      : LocationCategoryLocale.eng;

    return new HttpParams()
      .set('locale', locale)
      .set('location_type', LocationType.dining)
      .set('school_id', this.session.g.get('school').id)
      .set('search_str', state ? state.search_str : null)
      .set('sort_field', state ? state.sort_field : 'name')
      .set('sort_direction', state ? state.sort_direction : 'asc');
  }

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }
}