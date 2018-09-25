/*tslint:disable:max-line-length */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import {
  CPAlertComponent,
  CPAvatarComponent,
  CPButtonComponent,
  CPCharCounterComponent,
  CPCheckboxComponent,
  CPCheckDropdownComponent,
  CPChipComponent,
  CPDatePickerComponent,
  CPDropdownComponent,
  CPDropdownMultiSelectComponent,
  CPHeaderLinkComponent,
  CPImageUploadComponent,
  CPLightboxComponent,
  CPLineChartComponent,
  CPListModalComponent,
  CPMapsComponent,
  CPModalComponent,
  CPNoContentComponent,
  CPOnboardingComponent,
  CPPageHeaderComponent,
  CPPaginationComponent,
  CPPlaceAutoCompleteComponent,
  CPRangePickerComponent,
  CPResourceBannerComponent,
  CPSearchBoxComponent,
  CPSmallDatePickerComponent,
  CPSnackBarComponent,
  CPSortingHeaderComponent,
  CPSpinnerComponent,
  CPStarsComponent,
  CPStepperComponent,
  CPSwitchComponent,
  CPTabComponent,
  CPTextEditorComponent,
  CPTooltipComponent,
  CPTopBanerComponent,
  CPTopBarComponent,
  CPTopGaModalComponent,
  CPTrackersComponent,
  CPTypeAheadComponent,
  CPUploadButtonComponent,
  CPUploadModalBodyComponent,
  CPUploadModalComponent,
  CPImageCropperComponent,
  CPUploadModalFooterComponent,
  CPUploadModalHeaderComponent,
  CPWorkingComponent,
  SchoolSwitchComponent
} from './components';
import { CPLineChartUtilsService } from './components/cp-line-chart/cp-line-chart.utils.service';
import { CPRangePickerUtilsService } from './components/cp-range-picker/cp-range-picker.utils.service';
import { CPTabsComponent } from './components/cp-tabs/components/cp-tabs/cp-tabs.component';
import {
  CPTrackerDirective,
  CPColorPickerDirective,
  CPHostDirective,
  CPImageRatioDirective,
  CPLightboxDirective
} from './directives';
import { CPDatePipe, CPFilterPipe, CPI18nPipe, CPFIlterByLength } from './pipes';
import {
  CPLocationsService,
  FileUploadService,
  StoreService,
  CPMapsService,
  CPTrackingService
} from './services';
import { LocationsService } from '../containers/controlpanel/manage/locations/locations.service';

@NgModule({
  declarations: [
    CPImageRatioDirective,
    CPHostDirective,
    CPImageCropperComponent,
    CPColorPickerDirective,
    CPTabComponent,
    CPTabsComponent,
    CPFIlterByLength,
    CPTopBarComponent,
    CPMapsComponent,
    CPAvatarComponent,
    CPModalComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadButtonComponent,
    CPSpinnerComponent,
    CPDropdownComponent,
    CPCheckboxComponent,
    CPPageHeaderComponent,
    CPSearchBoxComponent,
    CPDatePipe,
    CPStarsComponent,
    CPFilterPipe,
    CPAlertComponent,
    CPAlertComponent,
    CPDatePickerComponent,
    CPSwitchComponent,
    CPDatePickerComponent,
    CPSmallDatePickerComponent,
    CPPaginationComponent,
    CPNoContentComponent,
    CPCheckDropdownComponent,
    CPImageUploadComponent,
    SchoolSwitchComponent,
    CPTrackersComponent,
    CPUploadModalComponent,
    CPChipComponent,
    CPTypeAheadComponent,
    CPSnackBarComponent,
    CPTrackerDirective,
    CPButtonComponent,
    CPTextEditorComponent,
    CPI18nPipe,
    CPOnboardingComponent,
    CPStepperComponent,
    CPTooltipComponent,
    CPResourceBannerComponent,
    CPTopGaModalComponent,
    CPTopBanerComponent,
    CPOnboardingComponent,
    CPStepperComponent,
    CPListModalComponent,
    CPUploadModalBodyComponent,
    CPUploadModalHeaderComponent,
    CPUploadModalFooterComponent,
    CPDropdownMultiSelectComponent,
    CPCharCounterComponent,
    CPWorkingComponent,
    CPHeaderLinkComponent,
    CPSortingHeaderComponent,
    CPRangePickerComponent,
    CPLineChartComponent,
    CPLightboxComponent,
    CPLightboxDirective
  ],

  entryComponents: [CPImageCropperComponent, CPLightboxComponent],

  imports: [CommonModule, RouterModule, ReactiveFormsModule, PopoverModule.forRoot()],

  providers: [
    StoreService,
    FileUploadService,
    CPTrackingService,
    CPLocationsService,
    LocationsService,
    CPMapsService,
    CPLineChartUtilsService,
    CPRangePickerUtilsService
  ],

  exports: [
    CPHostDirective,
    CPImageRatioDirective,
    CPColorPickerDirective,
    CPTabComponent,
    CPTabsComponent,
    CPFIlterByLength,
    CPTopBarComponent,
    CPMapsComponent,
    CPAvatarComponent,
    CPModalComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadButtonComponent,
    CPSpinnerComponent,
    CPDropdownComponent,
    CPCheckboxComponent,
    CPPageHeaderComponent,
    CPSearchBoxComponent,
    CPDatePipe,
    CPStarsComponent,
    CPFilterPipe,
    CPAlertComponent,
    CPAlertComponent,
    CPDatePickerComponent,
    CPSwitchComponent,
    CPDatePickerComponent,
    CPSmallDatePickerComponent,
    CPPaginationComponent,
    CPNoContentComponent,
    CPCheckDropdownComponent,
    CPImageUploadComponent,
    SchoolSwitchComponent,
    CPTrackersComponent,
    CPUploadModalComponent,
    CPChipComponent,
    CPTypeAheadComponent,
    CPSnackBarComponent,
    CPTrackerDirective,
    CPButtonComponent,
    CPTextEditorComponent,
    CPI18nPipe,
    CPOnboardingComponent,
    CPStepperComponent,
    CPTooltipComponent,
    CPResourceBannerComponent,
    CPTopGaModalComponent,
    CPTopBanerComponent,
    CPOnboardingComponent,
    CPStepperComponent,
    CPListModalComponent,
    CPUploadModalBodyComponent,
    CPUploadModalHeaderComponent,
    CPUploadModalFooterComponent,
    CPDropdownMultiSelectComponent,
    CPCharCounterComponent,
    CPWorkingComponent,
    CPHeaderLinkComponent,
    CPSortingHeaderComponent,
    CPRangePickerComponent,
    CPLineChartComponent,
    CPImageCropperComponent,
    CPLightboxComponent,
    CPLightboxDirective
  ]
})
export class SharedModule {}
