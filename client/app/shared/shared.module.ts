import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CPMapsComponent, CPModalComponent, CPTopBarComponent, CPAvatarComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPHamburgerComponent, CPMobileMenuComponent, CPPlaceAutoCompleteComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPStarComponent,
  CPAlertComponent, CPAnimatedButtonComponent, CPButtonDropdownComponent,
  CPDatePickerComponent, CPSwitchComponent, CPSmallDatePickerComponent, CPUploadButtonComponent,
  CPActionDropdownComponent
} from './components';

import {
  CPDatePipe,
  CPFilterPipe
} from './pipes';

import {
  StoreService,
  FileUploadService
} from './services';

@NgModule({
  declarations: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPMobileMenuComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent,  CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPAnimatedButtonComponent,
  CPButtonDropdownComponent, CPDatePickerComponent, CPSwitchComponent,
  CPAnimatedButtonComponent, CPButtonDropdownComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent, CPActionDropdownComponent ],

  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],

  providers: [ StoreService, FileUploadService ],

  exports: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPMobileMenuComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPAnimatedButtonComponent,
  CPButtonDropdownComponent, CPDatePickerComponent, CPSwitchComponent,
  CPAnimatedButtonComponent, CPButtonDropdownComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent, CPActionDropdownComponent  ]
})
export class SharedModule { }
