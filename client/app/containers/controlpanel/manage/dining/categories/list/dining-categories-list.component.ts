import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, tap, take } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { Destroyable, Mixin } from '@shared/mixins';
import { DiningCategoriesEditComponent } from '../edit';
import { DiningCategoriesCreateComponent } from '../create';
import { DiningCategoriesDeleteComponent } from '../delete';
import { CPI18nService, ModalService } from '@shared/services';
import { ICategory } from '@libs/locations/common/categories/model';
import { ICategoriesApiQuery } from '@libs/locations/common/categories/categories.status';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dining-categories-list',
  templateUrl: './dining-categories-list.component.html',
  styleUrls: ['./dining-categories-list.component.scss'],
  providers: [ModalService]
})
export class DiningCategoriesListComponent implements OnInit, OnDestroy {
  modal: OverlayRef;
  state: ICategoriesApiQuery;
  loading$: Observable<boolean>;
  categories$: Observable<ICategory[]>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public actions$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    private modalService: ModalService,
    public store: Store<fromStore.ICategoriesState | fromRoot.IHeader | fromRoot.ISnackbar>
  ) {}

  onSearch(search_str) {
    this.state = {
      ...this.state,
      search_str
    };

    this.fetchFilteredCategories();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetchFilteredCategories();
  }

  fetch() {
    this.store.dispatch(new fromStore.GetCategories());

    this.categories$ = this.store.select(fromStore.getCategories).pipe(takeUntil(this.destroy$));
  }

  fetchFilteredCategories() {
    this.store.dispatch(new fromStore.SetCategoriesApiQuery(this.state));
    this.store.dispatch(new fromStore.GetFilteredCategories());

    this.categories$ = this.store
      .select(fromStore.getFilteredCategories)
      .pipe(takeUntil(this.destroy$));
  }

  onLaunchCreateModal() {
    this.modal = this.modalService.open(DiningCategoriesCreateComponent, null, {
      onClose: this.resetModal.bind(this)
    });
  }

  onEdit(category: ICategory) {
    this.modal = this.modalService.open(DiningCategoriesEditComponent, null, {
      data: category,
      onClose: this.resetModal.bind(this)
    });
  }

  onDelete(category: ICategory) {
    this.modal = this.modalService.open(DiningCategoriesDeleteComponent, null, {
      data: category,
      onClose: this.resetModal.bind(this)
    });
  }

  resetModal() {
    this.modalService.close(this.modal);
    this.modal = null;
  }

  updateHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_locations_manage_categories',
        subheading: null,
        em: null,
        crumbs: {
          url: 'dining',
          label: 'dining'
        },
        children: []
      }
    });
  }

  loadCategories() {
    this.store
      .select(fromStore.getCategoriesLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }),
        take(1)
      )
      .subscribe();

    this.categories$ = this.store.select(fromStore.getCategories).pipe(takeUntil(this.destroy$));
  }

  loadCategoryTypes() {
    this.store
      .select(fromStore.getCategoriesType)
      .pipe(
        takeUntil(this.destroy$),
        tap((types: IItem[]) => {
          if (!types.length) {
            this.store.dispatch(new fromStore.GetCategoriesType());
          }
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.updateHeader();
    this.loadCategories();
    this.loadCategoryTypes();

    this.loading$ = this.store
      .select(fromStore.getCategoriesLoading)
      .pipe(takeUntil(this.destroy$));

    this.store
      .select(fromStore.getCategoriesParamState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => (this.state = state));
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}