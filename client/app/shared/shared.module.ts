/*tslint:disable:max-line-length */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';

// directives
import {
  CPHostDirective,
  CPTargetDirective,
  CPTrackerDirective,
  CPToolTipDirective,
  CPLightboxDirective,
  CPImageRatioDirective,
  CPColorPickerDirective,
  CPFeatureToggleDirective
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

import { LatLngValidators } from '@shared/validators';

import {
  CPTabComponent,
  CPCardComponent,
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
  CPDeleteModalComponent,
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
  CPFormFixedFooterComponent,
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
    CPCardComponent,
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
    CPTargetDirective,
    CPButtonComponent,
    CPSpinnerComponent,
    CPToolTipDirective,
    CPTrackerDirective,
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
    CPDeleteModalComponent,
    CPImageUploadComponent,
    CPRangePickerComponent,
    CPCharCounterComponent,
    CPImageCropperComponent,
    CPUploadButtonComponent,
    CPSortingHeaderComponent,
    CPCheckDropdownComponent,
    CPFeatureToggleDirective,
    CPResourceBannerComponent,
    CPFormFixedFooterComponent,
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
    LatLngValidators,
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
    CPCardComponent,
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
    CPTargetDirective,
    CPButtonComponent,
    CPTrackerDirective,
    CPSpinnerComponent,
    CPStepperComponent,
    CPStepperComponent,
    CPToolTipDirective,
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
    CPDeleteModalComponent,
    CPImageUploadComponent,
    CPUploadModalComponent,
    CPCharCounterComponent,
    CPColorPickerDirective,
    CPRangePickerComponent,
    CPUploadButtonComponent,
    CPImageCropperComponent,
    CPCheckDropdownComponent,
    CPSortingHeaderComponent,
    CPFeatureToggleDirective,
    CPResourceBannerComponent,
    CPFormFixedFooterComponent,
    CPSmallDatePickerComponent,
    CPUploadModalBodyComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadModalHeaderComponent,
    CPUploadModalFooterComponent,
    CPDropdownMultiSelectComponent
  ]
})
export class SharedModule {}
