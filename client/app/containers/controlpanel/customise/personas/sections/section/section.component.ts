import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { get as _get } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { TilesService } from './../../tiles/tiles.service';
import { ISnackbar, SNACKBAR_SHOW } from '../../../../../../reducers/snackbar.reducer';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services';
import { ITile } from '../../tiles/tile.interface';
import { ICampusGuide } from '../section.interface';
import { CategoryDeleteErrors } from '../section.status';
import { SectionUtilsService } from '../section.utils.service';
import { SectionsService } from '../sections.service';

@Component({
  selector: 'cp-personas-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class PersonasSectionComponent implements OnInit {
  @Input() last: boolean;
  @Input() first: boolean;
  @Input() tileWidth = '2';
  @Input() hideName: boolean;
  @Input() personaId: number;
  @Input() addSection = true;
  @Input() noControls = false;
  @Input() guide: ICampusGuide;

  @Output() swap: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<ICampusGuide> = new EventEmitter();
  @Output() removeSection: EventEmitter<number> = new EventEmitter();
  @Output() createNewSection: EventEmitter<ICampusGuide> = new EventEmitter();

  state = {
    working: false,
    sorting: false
  };

  lastRank;
  sortableOptions;

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public service: SectionsService,
    public tilesService: TilesService,
    public utils: SectionUtilsService
  ) {}

  onSavedGuide(newGuide) {
    this.guide = {
      ...this.guide,
      ...newGuide
    };
  }

  onEditedTile(editedTile: ITile) {
    this.guide = {
      ...this.guide,
      tiles: this.guide.tiles.map((tile: ITile) => (tile.id === editedTile.id ? editedTile : tile))
    };
  }

  onEditTile(tile: ITile) {
    this.service.guide = this.guide;
    this.router.navigate([`/customize/personas/${this.personaId}/tiles/${tile.id}/edit`]);
  }

  goToCreateTile() {
    if (this.guide._categoryZero) {
      return this.createCategoryZeroTile();
    }

    if (this.guide._featureTile) {
      return this.createFeatureTile();
    }

    this.service.guide = this.guide;
    this.router.navigate([`/customize/personas/${this.personaId}/tiles`]);
  }

  createFeatureTile() {
    const tempGuide = {
      ...this.guide,
      featureTile: true
    };
    this.service.guide = tempGuide;

    this.router.navigate([`/customize/personas/${this.personaId}/tiles`]);
  }

  createCategoryZeroTile() {
    const tempGuide = {
      ...this.guide,
      categoryZero: true
    };
    this.service.guide = tempGuide;

    this.router.navigate([`/customize/personas/${this.personaId}/tiles`]);
  }

  onMove(direction) {
    this.swap.emit(direction);
  }

  setWorkingState(working) {
    this.state = {
      ...this.state,
      working
    };
  }

  errorHandler(err) {
    let snackBarClass = 'danger';
    let body = _get(err, ['error', 'response'], this.cpI18n.translate('something_went_wrong'));

    if (body === CategoryDeleteErrors.NON_EMPTY_CATEGORY) {
      snackBarClass = 'warning';
      body = this.cpI18n.translate('t_personas_delete_guide_error_non_empty_category');
    }

    this.setWorkingState(false);

    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body,
        sticky: true,
        autoClose: true,
        class: snackBarClass
      }
    });
  }

  onAddSection() {
    this.createNewSection.emit(this.utils.temporaryGuide(this.guide.rank - 1));
  }

  onNameChange(name, updatedGuide: ICampusGuide) {
    if (this.utils.isTemporaryGuide(updatedGuide)) {
      this.guide = {
        ...this.guide,
        name
      };

      this.service.guide = this.guide;

      return;
    }

    const body = {
      name,
      school_id: this.session.g.get('school').id
    };

    this.setWorkingState(true);

    this.service.updateSectionTileCategory(this.guide.id, body).subscribe(
      (guide: ICampusGuide) => {
        this.guide = {
          ...this.guide,
          name: guide.name
        };

        this.setWorkingState(false);
      },
      (err) => this.errorHandler(err)
    );
  }

  onDeleteSection() {
    this.setWorkingState(true);
    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    if (this.utils.isTemporaryGuide(this.guide)) {
      this.deleted.emit(this.guide);

      return;
    }

    this.service.deleteSectionTileCategory(this.guide.id, search).subscribe(
      () => {
        this.deleted.emit(this.guide);
        this.setWorkingState(false);
      },
      (err) => this.errorHandler(err)
    );
  }

  onDeletedTile(tileId: number) {
    this.guide = {
      ...this.guide,
      tiles: this.guide.tiles.filter((tile: ITile) => tile.id !== tileId)
    };

    if (!this.guide.tiles.length) {
      this.removeSection.emit(this.guide.id);
    }
  }

  updateRank(stream$: Observable<any>) {
    this.state = { ...this.state, sorting: true };
    stream$.subscribe(
      () => {
        this.state = { ...this.state, sorting: false };
      },
      (err) => {
        this.errorHandler(err);
        this.state = { ...this.state, sorting: false };
      }
    );
  }

  onDragged({ oldIndex, newIndex }: any) {
    let updatedTileA;
    let updatedTileB;
    const tileA: ITile = this.utils.tileAtIndex(this.guide.tiles, oldIndex);
    const tileB: ITile = this.utils.tileAtIndex(this.guide.tiles, newIndex);

    const isFeatured = (t: ITile) => t.featured_rank > -1;

    if (isFeatured(tileA)) {
      updatedTileA = {
        featured_rank: tileB.featured_rank
      };

      updatedTileB = {
        featured_rank: tileA.featured_rank
      };
    } else {
      updatedTileA = {
        rank: tileB.rank
      };

      updatedTileB = {
        rank: tileA.rank
      };
    }

    updatedTileA = {
      ...updatedTileA,
      school_id: this.session.g.get('school').id
    };

    updatedTileB = {
      ...updatedTileB,
      school_id: this.session.g.get('school').id
    };

    const updateTileA$ = this.tilesService.updateCampusTile(tileA.id, updatedTileA);
    const updateTileB$ = this.tilesService.updateCampusTile(tileB.id, updatedTileB);
    const stream$ = combineLatest([updateTileA$, updateTileB$]);

    this.updateRank(stream$);
  }

  ngOnInit(): void {
    let groupName = this.guide.name;

    if (this.guide._categoryZero) {
      groupName = 'category_zero';
    }

    if (this.guide._featureTile) {
      groupName = 'featured';
    }

    this.sortableOptions = {
      scroll: false,
      group: groupName,
      draggable: '.draggable',
      onUpdate: this.onDragged.bind(this)
    };
  }
}
