import { appStorage } from './../utils/storage/storage';
import { API } from './../../config/api/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CPI18nService } from './index';

const maxAllowed = 8e6;

@Injectable()
export class FileUploadService {
  maxImageSize = maxAllowed; // 8MB
  maxFileSize = maxAllowed; // 8MB

  validFileTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];

  imageUploadUrl = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;

  validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  static validFileSize(file: File, maxSize = maxAllowed) {
    return file.size <= maxSize;
  }

  static getImageDimensions(image: File): Promise<{ height: number; width: number }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const img = new Image();
        img.src = fileReader.result;

        img.onload = () => resolve({ width: img.width, height: img.height });
      };

      fileReader.onerror = () => reject();

      fileReader.readAsDataURL(image);
    });
  }

  constructor(private http: HttpClient, private cpI18n: CPI18nService) {}

  validImage(file: File): { valid: boolean; errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateImage(file)
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file, this.maxImageSize)
    };

    const errors = [];

    if (!validType.valid) {
      errors.push(validType.message);
    }
    if (!validSize.valid) {
      errors.push(validSize.message);
    }

    return {
      valid: validType.valid && validSize.valid,
      errors
    };
  }

  validFile(file: File): { valid: boolean; errors: Array<string> } {
    const validType = {
      message: this.cpI18n.translate('error_invalid_extension'),
      valid: this.validateDoc(file)
    };

    const validSize = {
      message: this.cpI18n.translate('error_file_is_too_big'),
      valid: this.validateFileSize(file, this.maxFileSize)
    };

    const _errors = [];

    if (!validType.valid) {
      _errors.push(validType.message);
    }

    if (!validSize.valid) {
      _errors.push(validSize.message);
    }

    return {
      valid: validType.valid && validSize.valid,
      errors: _errors
    };
  }

  validateFileSize(media: File, maxFileSize): boolean {
    return media.size < maxFileSize;
  }

  validateDoc(media: File, validTypes = this.validFileTypes): boolean {
    return validTypes.includes(media.type);
  }

  validateImage(media: File, validTypes = this.validImageTypes): boolean {
    return validTypes.includes(media.type);
  }

  uploadFile(media: File, url: string = this.imageUploadUrl, customHeaders?: HttpHeaders) {
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    const formData: FormData = new FormData();

    formData.append('file', media, media.name);

    return this.http.post(url, formData, { headers: customHeaders ? customHeaders : headers });
  }
}
