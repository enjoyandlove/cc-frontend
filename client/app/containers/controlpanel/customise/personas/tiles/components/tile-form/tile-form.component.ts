import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from './../../../../../../../shared/services/file-upload.service';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-tile-form',
  templateUrl: './tile-form.component.html',
  styleUrls: ['./tile-form.component.scss']
})
export class PersonasTileFormComponent implements OnInit {
  @Input() uploadButtonId;
  @Input() campusLinkForm: FormGroup;
  @Input() campusGuideTileForm: FormGroup;

  @Output() campusLinkFormChange: EventEmitter<FormGroup> = new EventEmitter();
  @Output() campusGuideTileFormChange: EventEmitter<FormGroup> = new EventEmitter();

  resources;

  constructor(
    public fb: FormBuilder,
    public cpI18n: CPI18nService,
    public fileService: FileUploadService
  ) {}

  ngOnInit(): void {}
}
