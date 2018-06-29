/*tslint:disable:max-line-length */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../shared/shared.module';
import {
  PersonasTileFormStoreListComponent,
  PersonasTileFormResourceListComponent,
  PseronasTileBaseComponent,
  PersonasTileContentComponent,
  PersonasTileAddButtonComponent,
  PersonasTileFormComponent,
  PersonasTileGuideFormComponent,
  PersonasTileHoverComponent,
  PersonasTileFormTextComponent
} from './components';
import { PersonasTileCreateComponent } from './create';
import { PersonasTileComponent } from './tile/tile.component';
import { TilesService } from './tiles.service';
import { TilesUtilsService } from './tiles.utils.service';
import { PersonasTileLinkFormComponent } from './components/tile-link-form/tile-link-form.component';

@NgModule({
  declarations: [
    PersonasTileFormStoreListComponent,
    PersonasTileFormResourceListComponent,
    PersonasTileLinkFormComponent,
    PersonasTileGuideFormComponent,
    PersonasTileFormTextComponent,
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileContentComponent,
    PersonasTileAddButtonComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [
    PersonasTileFormStoreListComponent,
    PersonasTileFormResourceListComponent,
    PersonasTileLinkFormComponent,
    PersonasTileGuideFormComponent,
    PersonasTileFormTextComponent,
    PersonasTileContentComponent,
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileAddButtonComponent
  ],
  providers: [TilesUtilsService, TilesService]
})
export class PersonasTilesModule {}
