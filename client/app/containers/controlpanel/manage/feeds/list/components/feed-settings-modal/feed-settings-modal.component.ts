import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { FeedsService } from '../../../feeds.service';
import { CPSession } from '../../../../../../../session';
import { CPTrackingService } from '../../../../../../../shared/services';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss']
})
export class FeedSettingsComponent implements OnInit {
  @Input() groupId: number;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<any>;

  @Output() updateWallSettings: EventEmitter<null> = new EventEmitter();

  walls;
  wallName;
  modalTitle;
  privileges;
  form: FormGroup;
  _isCampusWallView;

  eventProperties = {
    wall_page: null,
    wall_source: null
  };

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    private feedsService: FeedsService,
    private cpTracking: CPTrackingService
  ) {
    this.feedsService.getSocialGroups();
  }

  private fetch() {
    let search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    if (this.groupType === GroupType.orientation) {
      search = search.append('calendar_id', this.groupId.toString());
    }

    this.feedsService
      .getSocialGroups(search)
      .pipe(
        map((groups: Array<any>) => {
          let _groups = [];

          groups.forEach((group) => {
            _groups.push({
              id: group.id,
              name: group.name,
              related_obj_id: group.related_obj_id,
              min_posting_member_type: group.min_posting_member_type,
              min_commenting_member_type: group.min_commenting_member_type
            });
          });

          if (this.groupId) {
            _groups = _groups.filter((group) => group.related_obj_id === +this.groupId);
          }

          return _groups;
        })
      )
      .subscribe((walls) => {
        walls.forEach((wall) => this.addFeedControl(wall));
      });
  }

  createFeedControl(wall) {
    return this.fb.group({
      name: [wall.name, Validators.required],
      wall_id: [wall.id, Validators.required],
      min_posting_member_type: [wall.min_posting_member_type, Validators.required],
      min_commenting_member_type: [wall.min_commenting_member_type, Validators.required]
    });
  }

  addFeedControl(wall) {
    const control = <FormArray>this.form.controls['walls'];
    control.push(this.createFeedControl(wall));
  }

  onCanPostChanged(event, index) {
    const controls = <FormArray>this.form.controls['walls'];
    const control = <FormGroup>controls.at(index);

    control.controls['min_posting_member_type'].setValue(event.action);

    this.updateGroup(control);
  }

  onCanCommentChanged(event, index) {
    const controls = <FormArray>this.form.controls['walls'];
    const control = <FormGroup>controls.at(index);

    control.controls['min_commenting_member_type'].setValue(event.action);

    this.updateGroup(control);
  }

  updateGroup(control) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.feedsService
      .upodateSocialGroup(control.value.wall_id, control.value, search)
      .subscribe((res: any) => {
        this.trackAmplitudeEvent();
        this.updateWallSettings.emit(res);
      });
  }

  getPrivilegeObj(privilege) {
    let result;

    this.privileges.forEach((_privilege) => {
      if (_privilege.action === privilege) {
        result = _privilege;
      }
    });

    return result;
  }

  trackAmplitudeEvent() {
    const wall_source = this._isCampusWallView
      ? amplitudeEvents.CAMPUS_WALL
      : amplitudeEvents.OTHER_WALLS;

    this.eventProperties = {
      ...this.eventProperties,
      wall_source,
      wall_page: this.utils.wallPage(this.groupType)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_UPDATED_SETTINGS, this.eventProperties);
  }

  ngOnInit() {
    this.wallName =
      this.groupType === GroupType.orientation
        ? this.cpI18n.translate('orientation_wall_name')
        : this.cpI18n.translate('feeds_wall_name');

    this.modalTitle =
      this.groupType === GroupType.orientation
        ? this.cpI18n.translate('orientation_feeds_wall_settings_modal_title')
        : this.cpI18n.translate('feeds_wall_settings_modal_title');

    this.fetch();
    this.form = this.fb.group({
      walls: this.fb.array([])
    });

    this.privileges = [
      {
        label: this.cpI18n.translate('no_one'),
        action: 100
      },
      {
        label: this.cpI18n.translate('feeds_team_members'),
        action: 3
      },
      {
        label: this.cpI18n.translate('feeds_everyone'),
        action: 0
      }
    ];

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }
}
