import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  ElementRef,
  EventEmitter,
} from '@angular/core';

import { MemberType } from '../member.status';
import { MembersService } from '../members.service';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-members-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ClubsMembersEditComponent implements OnInit {
  @Input() member: any;
  @Input() groupId: number;
  @ViewChild('input') input: ElementRef;
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formErrors;
  memberTypes;
  defaultType;
  members = [];
  form: FormGroup;
  isTouched = false;

  constructor(
    private fb: FormBuilder,
    private cpI18n: CPI18nService,
    private service: MembersService,
  ) { }

  onMemberSelected(member) {
    this.members = [];
    this.input.nativeElement.value = member.label;
    this.form.controls['member'].setValue(member.id);
  }

  onTypeChange(type): void {
    let control = this.form.controls['member_type'];
    control.setValue(type);
  }

  doTearDown() {
    this.teardown.emit();
    $('#membersEdit').modal('hide');
  }

  onSave() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      return;
    }

    let member_type = this.form.value.member_type;
    let group_id = this.groupId;

    this
      .service
      .addMember({ member_type, group_id }, this.member.id)
      .subscribe(
        member => {
          this.edited.emit(member);
          $('#membersEdit').modal('hide');
          this.form.reset();
          this.doTearDown();

        },
        err => { throw new Error(err) }
      );
  }

  ngOnInit() {
    this.memberTypes = [
      {
        label: this.cpI18n.translate('member'),
        action: MemberType.member
      },
      {
        label: this.cpI18n.translate('executive'),
        action: MemberType.executive
      }
    ];

    this.defaultType = this.memberTypes.filter(type => type.action === this.member.member_type)[0];

    this.form = this.fb.group({
      'member': [null],
      'member_type': [this.memberTypes[0].action, Validators.required],
    });

    this.form.valueChanges.subscribe(value => {
      this.isTouched = value.member_type !== this.member.member_type;
    });
  }
}
