import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

import { EmployerModule } from '../employer.module';
import * as fromJobs from '@campus-cloud/store/manage/jobs';
import { EmployerDeleteComponent } from './employer-delete.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('EmployerDeleteComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [EmployerModule, RouterTestingModule, StoreModule.forRoot({}), CPTestModule],
        providers: [Store, Actions]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let component: EmployerDeleteComponent;
  let fixture: ComponentFixture<EmployerDeleteComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployerDeleteComponent);
    component = fixture.componentInstance;

    component.employer = {
      id: 84,
      name: 'Hello World',
      description: 'This is description'
    };
    fixture.detectChanges();
  }));

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should dispatch delete action', () => {
    spy = spyOn(component.store, 'dispatch');
    component.onDelete();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new fromJobs.DeleteEmployer(component.employer.id));
  });

  it('should emit after delete', async(() => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');

    component.store.dispatch(new fromJobs.DeleteEmployerSuccess(component.employer.id));
    fixture.detectChanges();

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.employer.id);
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  }));
});
