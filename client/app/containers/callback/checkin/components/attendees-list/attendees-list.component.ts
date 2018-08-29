import { Component, Input } from '@angular/core';

import ICheckIn from '../../checkin.interface';
import IAttendee from '../attendee.interface';
import { FORMAT } from '../../../../../shared/pipes';
import { CheckInOutTime, CheckInType } from '../../../callback.status';

@Component({
  selector: 'cp-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.scss']
})
export class CheckinAttendeesListComponent {
  @Input() data: ICheckIn;

  timezone: string;
  attendee: IAttendee;
  launchCheckOutModal = false;
  dateFormat = FORMAT.DATETIME;
  empty = CheckInOutTime.empty;

  checkInMethodType(method) {
    return method === CheckInType.web ? 'computer' : 'smartphone';
  }

  onCheckOutModal(attendee: IAttendee) {
    this.attendee = attendee;
    this.launchCheckOutModal = true;

    setTimeout(
      () => {
        $('#checkOutModal').modal();
      },

      1
    );
  }

  showCheckOutButton(attendee: IAttendee) {
    return (!attendee.check_out_time_epoch
      || attendee.check_out_time_epoch === this.empty)
      && attendee.check_in_type === CheckInType.web;
  }

  onCheckOut(newAttendee: IAttendee) {
    this.attendee = null;
    this.launchCheckOutModal = true;

    const attendees = this.data.attendees
      .map((attendee: IAttendee) => attendee.attendance_id === newAttendee.attendance_id
        ? newAttendee : attendee);

    this.data = {
      ...this.data,
      attendees
    };
  }
}
