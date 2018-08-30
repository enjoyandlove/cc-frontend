import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/index';

import { EventsModule } from '../../../events.module';
import { CheckInMethod } from '../../../event.status';
import { CPSession } from '../../../../../../../session';
import { EventUtilService } from '../../../events.utils.service';
import { mockUser } from '../../../../../../../session/mock/user';
import { mockSchool } from '../../../../../../../session/mock/school';
import { CPI18nService } from '../../../../../../../shared/services';
import { EventsAttendanceActionBoxComponent } from './events-attendance-action-box.component';

const mockAttendees = require('../../../__mock__/eventAttendees.json');

describe('EventsAttendanceActionBoxComponent', () => {
  let component: EventsAttendanceActionBoxComponent;
  let fixture: ComponentFixture<EventsAttendanceActionBoxComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [EventsModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, EventUtilService]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsAttendanceActionBoxComponent);
          component = fixture.componentInstance;
          component.session.g.set('user', mockUser);
          component.session.g.set('school', mockSchool);
          component.updateQrCode = new BehaviorSubject(null);
          component.totalAttendees = new BehaviorSubject(null);

          component.event = {
            store_id: 12548
          };
        });
    })
  );

  it('toggle updateQrCode', () => {
    const enableQrLabel = component.cpI18n.translate('t_events_assessment_disable_qr_check_in');
    const disableQrLabel = component.cpI18n.translate('t_events_assessment_enable_qr_check_in');
    component.updateQrCode.next([CheckInMethod.web, CheckInMethod.app, CheckInMethod.webQr]);

    component.ngOnInit();
    expect(component.hasQr).toBeTruthy();
    expect(component.qrLabel).toBe(enableQrLabel);

    component.updateQrCode.next([CheckInMethod.web, CheckInMethod.webQr]);

    component.ngOnInit();
    expect(component.hasQr).toBeFalsy();
    expect(component.qrLabel).toBe(disableQrLabel);
  });

  it('disable canMessage permission', () => {
    component.totalAttendees.next(mockAttendees);
    component.session.g.set('user', { school_level_privileges: {} });

    const noPermissionTooltip = component.cpI18n.
    translate('t_events_attendance_no_permission_tooltip_text');

    component.ngOnInit();

    expect(component.canMessage).toBeFalsy();
    expect(component.disableMessageAttendees).toBeTruthy();
    expect(component.messageAttendeesTooltipText).toBe(noPermissionTooltip);
  });

  it('no students to message', () => {
    component.totalAttendees.next(mockAttendees);

    const noStudentTooltip = component.cpI18n.
    translate('t_events_attendance_no_students_tooltip_text');

    component.ngOnInit();

    expect(component.canMessage).toBeTruthy();
    expect(component.disableMessageAttendees).toBeTruthy();
    expect(component.messageAttendeesTooltipText).toBe(noStudentTooltip);
  });
});
