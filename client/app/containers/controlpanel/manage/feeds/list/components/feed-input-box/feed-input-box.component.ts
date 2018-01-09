import { Input, OnInit, Output, Component, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Headers, URLSearchParams } from '@angular/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import {
  StoreService,
  FileUploadService,
} from '../../../../../../../shared/services';

import { API } from '../../../../../../../config/api';
import { FeedsService } from '../../../feeds.service';
import { appStorage } from '../../../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../../../session';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-feed-input-box',
  templateUrl: './feed-input-box.component.html',
  styleUrls: ['./feed-input-box.component.scss'],
})
export class FeedInputBoxComponent implements OnInit {
  @Input() clubId: number;
  @Input() disablePost: boolean;
  @Input() isCampusWallView: Observable<any>;
  @Output() created: EventEmitter<null> = new EventEmitter();

  groupId;
  stores$;
  channels$;
  imageError;
  form: FormGroup;
  school: ISchool;
  _isCampusWallView;
  DISABLED_MEMBER_TYPE = 100;
  image$: BehaviorSubject<string> = new BehaviorSubject(null);
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetTextEditor$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private feedsService: FeedsService,
    private storeService: StoreService,
    private fileUploadService: FileUploadService,
  ) {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.stores$ = this.storeService.getStores(search);

    this.channels$ = this.feedsService
      .getChannelsBySchoolId(1, 100, search)
      .startWith([{ label: '---' }])
      .map((channels) => {
        const _channels = [
          {
            label: '---',
            action: null,
          },
        ];

        channels.forEach((channel) => {
          const _channel = {
            label: channel.name,
            action: channel.id,
          };

          _channels.push(_channel);
        });

        return _channels;
      });
  }

  onSubmit(data) {
    const _data = this.parseData(data);
    const groupWall$ = this.feedsService.postToGroupWall(_data);
    const campusWall$ = this.feedsService.postToCampusWall(_data);
    const stream$ = this._isCampusWallView ? groupWall$ : campusWall$;

    stream$.subscribe((res) => {
      if (!this.clubId) {
        this.form.reset();
      }
      this.form.controls['message'].setValue(null);
      this.reset$.next(true);
      this.resetTextEditor$.next(true);
      this.created.emit(res);
    });
  }

  parseData(data) {
    const _data = {
      post_type: data.post_type || null,
      store_id: data.store_id,
      school_id: this.session.g.get('school').id,
      message: data.message,
      message_image_url: data.message_image_url,
    };

    if (this._isCampusWallView) {
      _data['group_id'] = this.groupId;
    }

    return _data;
  }

  onContentChange(data: { body: string; image: string }) {
    this.form.controls['message'].setValue(data.body);
    this.form.controls['message_image_url'].setValue(data.image);
  }

  onSelectedHost(host): void {
    this.form.controls['store_id'].setValue(host.value);
  }

  onSelectedChannel(channel): void {
    this.form.controls['post_type'].setValue(channel.action);
  }

  onFileUpload(file) {
    this.imageError = null;
    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.imageError = validate.errors[0];

      return;
    }

    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(
      appStorage.keys.SESSION,
    )}`;

    headers.append('Authorization', auth);

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res) => {
        this.image$.next(res.image_url);
        this.form.controls['message_image_url'].setValue(res.image_url);
      },
      (err) => {
        throw new Error(err);
      },
    );
  }

  removePhoto(): void {
    this.form.controls['message_image_url'].setValue(null);
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    this.isCampusWallView.subscribe((res) => {
      // Not Campus Wall
      if (res.type !== 1) {
        this.groupId = res.type;
        this.form.controls['store_id'].setValue(res.group_id);
        this.form.removeControl('post_type');
        this._isCampusWallView = true;

        return;
      }

      if (this.form) {
        this.form.registerControl(
          'post_type',
          new FormControl(null, Validators.required),
        );
        this.form.controls['store_id'].setValue(null);
      }

      this._isCampusWallView = false;
    });

    this.form = this.fb.group({
      group_id: [null],
      school_id: [this.session.g.get('school').id],
      store_id: [null, Validators.required],
      post_type: [null, Validators.required],
      message: [null, [Validators.required, Validators.maxLength(500)]],
      message_image_url: [null],
    });
  }
}