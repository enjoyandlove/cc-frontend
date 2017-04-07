/**
 * https://chmln.github.io/flatpickr/
 */
import {
  Input,
  OnInit,
  Component,
  ViewChild,
  OnChanges,
  ElementRef,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-datepicker',
  templateUrl: './cp-datepicker.component.html',
  styleUrls: ['./cp-datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CPDatePickerComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('input') input: ElementRef;
  @Input() error: boolean;
  @Input() options: any;
  flatPicker;
  el;

  constructor() {
    this.flatPicker = require('flatpickr');
  }

  ngAfterViewInit() {
    const el = this.input.nativeElement;

    this.el = $(el).flatpickr(this.options);
  }

  ngOnChanges() {
    if (this.el) {
      if (this.error) {
        this.el.altInput.classList.add('error');
        return;
      }
      this.el.altInput.classList.remove('error');
    }
  }

  ngOnInit() { }
}
