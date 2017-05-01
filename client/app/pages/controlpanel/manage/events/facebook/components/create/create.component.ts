import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { EventsService } from '../../../events.service';

@Component({
  selector: 'cp-facebook-events-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class FacebookEventsCreateComponent implements OnInit {
  @Input() stores: Array<any>;
  @Input() storeId: number;
  @Output() created: EventEmitter<null> = new EventEmitter();

  errors = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService
  ) { }

  onSubmit(data) {
    this.errors = [];
    let search = new URLSearchParams();
    search.append('school_id', '157');

    this
      .eventsService
      .createFacebookEvent(data, search)
      .subscribe(
        _ => {
          this.form.reset();
          this.created.emit();
        },
        err => {
          if (err.status === 400) {
            this.errors.push('Duplicate event for host');
            return;
          }
          console.log(err);
        }
      );
  }

  onSelectedStore(host) {
    this.form.controls['store_id'].setValue(host.action);
  }

  ngOnInit() {
    this.form = this.fb.group({
      'url': [null, Validators.required],
      'store_id': [this.storeId || null, Validators.required]
    });
  }
}