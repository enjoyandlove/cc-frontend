import {
  OnInit,
  Input,
  Output,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

import { CPSession } from './../../../session';
import { CPDate } from './../../utils/date/date';
import { FORMAT, CPDatePipe } from './../../pipes/date/date.pipe';

interface IDateChange {
  end: number;
  start: number;
  label: string;
}

declare var $: any;
import 'flatpickr';
import * as moment from 'moment';

@Component({
  selector: 'cp-range-picker',
  templateUrl: './cp-range-picker.component.html',
  styleUrls: ['./cp-range-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPRangePickerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendarEl') calendarEl: ElementRef;

  @Input() dateRanges;
  @Input() icon: boolean;
  @Input() class: string;
  @Output() dateChange: EventEmitter<IDateChange> = new EventEmitter();

  picker;
  datePipe;
  selected = null;
  dateFormat = FORMAT.SHORT;
  pickerOptions;

  @Input()
  set state(state) {
    this.setLabel(state);
  }

  constructor(public session: CPSession) {}

  onDateChanged(selectedDates) {
    if (selectedDates.length === 2) {
      const formattedStart = this.datePipe.transform(
        CPDate.toEpoch(selectedDates[0], this.session.tz),
        this.dateFormat
      );
      const formattedEnd = this.datePipe.transform(
        CPDate.toEpoch(selectedDates[1], this.session.tz),
        this.dateFormat
      );

      const date = {
        start: this.dayStart(selectedDates[0]),
        end: this.dayEnd(selectedDates[1]),
        label: `${formattedStart} - ${formattedEnd}`
      };

      this.setLabel(date);
      this.triggerChange();
    }
  }

  dayStart(date) {
    return CPDate.toEpoch(moment(date).startOf('day'), this.session.tz);
  }

  dayEnd(date) {
    return CPDate.toEpoch(moment(date).endOf('day'), this.session.tz);
  }

  resetCalendar() {
    this.picker.clear();
  }

  ngAfterViewInit() {
    const host = this.calendarEl.nativeElement;
    this.pickerOptions = Object.assign({}, this.pickerOptions, {
      onChange: this.onDateChanged.bind(this)
    });

    this.picker = $(host).flatpickr(this.pickerOptions);
  }

  handleCustomDate(date) {
    this.setLabel(date);
    this.triggerChange();
    this.resetCalendar();
  }

  triggerChange() {
    this.dateChange.emit(this.selected);
  }

  setLabel(date) {
    this.selected = date;
  }

  ngOnDestroy() {
    this.picker.destroy();
  }

  ngOnInit() {
    this.datePipe = new CPDatePipe(this.session);

    this.pickerOptions = {
      utc: true,
      inline: true,
      mode: 'range',
      altInput: true,
      maxDate: CPDate.now(this.session.tz)
        .subtract(1, 'days')
        .startOf('day')
        .format(),
      enableTime: false,
      altFormat: 'F j, Y'
    };
  }
}
