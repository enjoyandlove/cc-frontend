import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CPMapsComponent, CPModalComponent, CPTopBarComponent, CPAvatarComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent, CPPlaceAutoCompleteComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPStarsComponent,
  CPAlertComponent, CPDatePickerComponent, CPSwitchComponent,
  CPSmallDatePickerComponent, CPUploadButtonComponent, CPPaginationComponent,
  CPNoContentComponent, CPCheckDropdownComponent, CPImageUploadComponent,
  SchoolSwitchComponent, CPIntercommComponent, CPTrackersComponent, CPChipComponent,
  CPTypeAheadComponent, CPUploadModalComponent, CPSnackBarComponent
} from './components';

import {
  CPDatePipe,
  CPFilterPipe
} from './pipes';

import {
  CPTrackerDirective
} from './directives';

import {
  StoreService,
  FileUploadService
} from './services';

@NgModule({
  declarations: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent,  CPCheckboxComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPDatePipe,
  CPStarsComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPDatePickerComponent, CPSwitchComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent, CPPaginationComponent, CPNoContentComponent,
  CPCheckDropdownComponent, CPImageUploadComponent, SchoolSwitchComponent, CPIntercommComponent,
  CPTrackersComponent, CPUploadModalComponent, CPChipComponent, CPTypeAheadComponent,
  CPSnackBarComponent, CPTrackerDirective ],

  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],

  providers: [ StoreService, FileUploadService ],

  exports: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPDatePipe,
  CPStarsComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPDatePickerComponent, CPSwitchComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent, CPPaginationComponent, CPNoContentComponent,
  CPCheckDropdownComponent, CPImageUploadComponent, SchoolSwitchComponent, CPIntercommComponent,
  CPTrackersComponent, CPUploadModalComponent, CPChipComponent, CPTypeAheadComponent,
  CPSnackBarComponent, CPTrackerDirective ]
})
export class SharedModule { }
