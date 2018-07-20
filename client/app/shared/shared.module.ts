/*tslint:disable:max-line-length */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CPLineChartUtilsService } from './components/cp-line-chart/cp-line-chart.utils.service';
import { CPRangePickerUtilsService } from './components/cp-range-picker/cp-range-picker.utils.service';
import { CPTabsComponent } from './components/cp-tabs/components/cp-tabs/cp-tabs.component';
import { CPTrackerDirective } from './directives';
import { CPColorPickerDirective } from './directives/color-picker/color-picker.directive';
import { CPDatePipe, CPFilterPipe, CPI18nPipe } from './pipes';
import { CPFIlterByLength } from './pipes/array/filter-by-length.pipe';
import { CPLocationsService, FileUploadService, StoreService } from './services';
import { CPMapsService } from './services/maps.service';
import { CPTrackingService } from './services/tracking.service';
import { LocationsService } from '../containers/controlpanel/manage/locations/locations.service';
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
  CPListModalComponent,
  CPMapsComponent,
  CPModalComponent,
  CPNoContentComponent,
  CPOnboardingComponent,
  CPPageHeaderComponent,
  CPPaginationComponent,
  CPPlaceAutoCompleteComponent,
  CPResourceBannerComponent,
  CPSearchBoxComponent,
  CPSmallDatePickerComponent,
  CPSnackBarComponent,
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
  CPUploadModalFooterComponent,
  CPUploadModalHeaderComponent,
  CPWorkingComponent,
  SchoolSwitchComponent,
  CPSortingHeaderComponent,
  CPRangePickerComponent,
  CPLineChartComponent
} from './components';

@NgModule({
  declarations: [
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
    CPLineChartComponent
  ],

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
    CPColorPickerDirective,
    CPRangePickerComponent,
    CPLineChartComponent
  ]
})
export class SharedModule {}
