/*tslint:disable:max-line-length */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';

// directives
import {
  CPHostDirective,
  CPTrackerDirective,
  CPLightboxDirective,
  CPImageRatioDirective,
  CPColorPickerDirective
} from './directives';

// services
import {
  StoreService,
  CPMapsService,
  CPTrackingService,
  FileUploadService,
  CPLocationsService,
  CPAmplitudeService
} from './services';

import { LocationsService } from '../containers/controlpanel/manage/locations/locations.service';
import { CPLineChartUtilsService } from './components/cp-line-chart/cp-line-chart.utils.service';
import { CPRangePickerUtilsService } from './components/cp-range-picker/cp-range-picker.utils.service';

// pipes
import { CPDatePipe, CPFilterPipe, CPI18nPipe, CPFIlterByLength } from './pipes';

// components
import { CPTabsComponent } from './components/cp-tabs/components/cp-tabs/cp-tabs.component';

import {
  CPTabComponent,
  CPChipComponent,
  CPMapsComponent,
  CPAlertComponent,
  CPModalComponent,
  CPStarsComponent,
  CPAvatarComponent,
  CPButtonComponent,
  CPTopBarComponent,
  CPSwitchComponent,
  CPWorkingComponent,
  CPSpinnerComponent,
  CPTooltipComponent,
  CPStepperComponent,
  CPSnackBarComponent,
  CPCheckboxComponent,
  CPDropdownComponent,
  CPLightboxComponent,
  CPTrackersComponent,
  CPTopBanerComponent,
  CPTypeAheadComponent,
  CPSearchBoxComponent,
  CPLineChartComponent,
  CPListModalComponent,
  CPNoContentComponent,
  CPDatePickerComponent,
  CPHeaderLinkComponent,
  CPOnboardingComponent,
  CPPageHeaderComponent,
  CPPaginationComponent,
  CPTextEditorComponent,
  CPTopGaModalComponent,
  SchoolSwitchComponent,
  CPRangePickerComponent,
  CPImageUploadComponent,
  CPUploadModalComponent,
  CPCharCounterComponent,
  CPUploadButtonComponent,
  CPImageCropperComponent,
  CPCheckDropdownComponent,
  CPSortingHeaderComponent,
  CPResourceBannerComponent,
  CPSmallDatePickerComponent,
  CPUploadModalBodyComponent,
  CPPlaceAutoCompleteComponent,
  CPUploadModalFooterComponent,
  CPUploadModalHeaderComponent,
  CPDropdownMultiSelectComponent
} from './components';

@NgModule({
  declarations: [
    CPI18nPipe,
    CPDatePipe,
    CPFilterPipe,
    CPTabComponent,
    CPHostDirective,
    CPMapsComponent,
    CPTabsComponent,
    CPChipComponent,
    CPAlertComponent,
    CPStarsComponent,
    CPModalComponent,
    CPAlertComponent,
    CPFIlterByLength,
    CPSwitchComponent,
    CPTopBarComponent,
    CPAvatarComponent,
    CPButtonComponent,
    CPSpinnerComponent,
    CPTrackerDirective,
    CPTooltipComponent,
    CPStepperComponent,
    CPStepperComponent,
    CPWorkingComponent,
    CPTopBanerComponent,
    CPDropdownComponent,
    CPCheckboxComponent,
    CPTrackersComponent,
    CPSnackBarComponent,
    CPLightboxDirective,
    CPLightboxComponent,
    CPNoContentComponent,
    CPTypeAheadComponent,
    CPSearchBoxComponent,
    CPListModalComponent,
    CPLineChartComponent,
    CPPageHeaderComponent,
    CPDatePickerComponent,
    CPDatePickerComponent,
    CPTopGaModalComponent,
    CPImageRatioDirective,
    CPOnboardingComponent,
    CPPaginationComponent,
    CPTextEditorComponent,
    CPOnboardingComponent,
    CPHeaderLinkComponent,
    SchoolSwitchComponent,
    CPUploadModalComponent,
    CPColorPickerDirective,
    CPImageUploadComponent,
    CPRangePickerComponent,
    CPCharCounterComponent,
    CPImageCropperComponent,
    CPUploadButtonComponent,
    CPSortingHeaderComponent,
    CPCheckDropdownComponent,
    CPResourceBannerComponent,
    CPSmallDatePickerComponent,
    CPUploadModalBodyComponent,
    CPUploadModalFooterComponent,
    CPUploadModalHeaderComponent,
    CPPlaceAutoCompleteComponent,
    CPDropdownMultiSelectComponent
  ],

  entryComponents: [CPLightboxComponent, CPImageCropperComponent],

  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, PopoverModule.forRoot()],

  providers: [
    StoreService,
    CPMapsService,
    LocationsService,
    CPTrackingService,
    FileUploadService,
    CPLocationsService,
    CPAmplitudeService,
    CPLineChartUtilsService,
    CPRangePickerUtilsService
  ],

  exports: [
    CPDatePipe,
    CPI18nPipe,
    CPFilterPipe,
    CPTabComponent,
    CPMapsComponent,
    CPHostDirective,
    CPTabsComponent,
    CPChipComponent,
    CPAlertComponent,
    CPFIlterByLength,
    CPStarsComponent,
    CPAlertComponent,
    CPModalComponent,
    CPSwitchComponent,
    CPTopBarComponent,
    CPAvatarComponent,
    CPButtonComponent,
    CPTrackerDirective,
    CPSpinnerComponent,
    CPStepperComponent,
    CPStepperComponent,
    CPTooltipComponent,
    CPWorkingComponent,
    CPDropdownComponent,
    CPTrackersComponent,
    CPCheckboxComponent,
    CPSnackBarComponent,
    CPTopBanerComponent,
    CPLightboxComponent,
    CPLightboxDirective,
    CPListModalComponent,
    CPNoContentComponent,
    CPTypeAheadComponent,
    CPSearchBoxComponent,
    CPLineChartComponent,
    CPHeaderLinkComponent,
    CPTextEditorComponent,
    CPTopGaModalComponent,
    CPPageHeaderComponent,
    CPDatePickerComponent,
    CPOnboardingComponent,
    CPDatePickerComponent,
    CPPaginationComponent,
    CPImageRatioDirective,
    CPOnboardingComponent,
    SchoolSwitchComponent,
    CPImageUploadComponent,
    CPUploadModalComponent,
    CPCharCounterComponent,
    CPColorPickerDirective,
    CPRangePickerComponent,
    CPUploadButtonComponent,
    CPImageCropperComponent,
    CPCheckDropdownComponent,
    CPSortingHeaderComponent,
    CPResourceBannerComponent,
    CPSmallDatePickerComponent,
    CPUploadModalBodyComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadModalHeaderComponent,
    CPUploadModalFooterComponent,
    CPDropdownMultiSelectComponent
  ]
})
export class SharedModule {}
