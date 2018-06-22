import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { API } from '../../../config/api';
import { CPI18nService } from '../../services';
import { appStorage } from '../../../shared/utils';
import { FileUploadService } from '../../../shared/services/file-upload.service';

@Component({
  selector: 'cp-image-upload',
  templateUrl: './cp-image-upload.component.html',
  styleUrls: ['./cp-image-upload.component.scss']
})
export class CPImageUploadComponent implements OnInit {
  @Input() id = 'upload_component';
  @Input() small: boolean;
  @Input() required: boolean;
  @Input() defaultImage: string;
  @Input() description: string;
  @Output() uploaded: EventEmitter<string> = new EventEmitter();

  image;
  error;
  fileName;
  isLoading;
  buttonText;

  constructor(public cpI18n: CPI18nService, private fileUploadService: FileUploadService) {}

  onFileUpload(file, asPromise?: boolean) {
    this.error = null;

    if (!file) {
      this.image = null;

      return;
    }

    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      if (asPromise) {
        return Promise.reject(validate.errors[0]);
      }

      this.error = validate.errors[0];

      return;
    }

    this.isLoading = true;

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    if (asPromise) {
      return this.fileUploadService.uploadFile(file, url, headers).toPromise();
    }

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.image = res.image_url;
        this.uploaded.emit(res.image_url);
      },
      (_) => {
        this.isLoading = false;
        this.error = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  removeImage() {
    this.image = null;
    this.uploaded.emit(null);
  }

  ngOnInit() {
    this.buttonText = this.cpI18n.translate('upload_picture');

    if (!this.description) {
      this.description = this.cpI18n.translate('component_cpimage_description');
    }

    if (this.defaultImage) {
      this.image = this.defaultImage;
    }
  }
}
