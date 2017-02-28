import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface IState {
  event_manager: number;
  event_attendance: boolean;
  attendance_manager: string;
  attendance_feedback: boolean;
}

const actionState = {
  event_attendance: false,
  event_manager: null,
  attendance_manager: null,
  attendance_feedback: false
};

@Component({
  selector: 'cp-action-dropdown',
  templateUrl: './cp-action-dropdown.component.html',
  styleUrls: ['./cp-action-dropdown.component.scss']
})
export class CPActionDropdownComponent implements OnInit {
  @Output() bulkAction: EventEmitter<IState> = new EventEmitter();
  isOpen = false;
  id1 = 'id1';
  id2 = 'id2';
  state = actionState;

  constructor() { }

  toggleEventAttendance() {
    this.state = Object.assign({}, this.state,
    { event_attendance: !this.state.event_attendance });
    return;
  }

  updateEventManager(manager) {
    this.state = Object.assign({}, this.state,
    { event_manager: manager });
    return;
  }

  updateAttendanceManager(manager) {
    this.state = Object.assign({}, this.state,
    { attendance_manager: manager });
    return;
  }

  toggleAttendanceFeedback() {
    this.state = Object.assign({}, this.state,
    { attendance_feedback: !this.state.attendance_feedback });
    return;
  }

  doSubmit() {
    this.bulkAction.emit(this.state);
    this.isOpen = false;
  }

  ngOnInit() { }
}
