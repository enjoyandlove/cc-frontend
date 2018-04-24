import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { TodosModule } from '../todos.module';
import { TodosService } from '../todos.service';
import { CPSession } from '../../../../../../session';
import { mockSchool } from '../../../../../../session/mock/school';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OrientationTodosEditComponent } from './orientation-todos-edit.component';

class MockTodosService {
  dummy;

  editTodo(todoId: number, body: any, search: any) {
    this.dummy = [todoId, body, search];

    return Observable.of({});
  }

}

describe('OrientationTodosEditComponent', () => {
  let spy;
  let search;
  let service: TodosService;
  let component: OrientationTodosEditComponent;
  let fixture: ComponentFixture<OrientationTodosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TodosModule],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        { provide: TodosService, useClass: MockTodosService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OrientationTodosEditComponent);
        component = fixture.componentInstance;
        service = TestBed.get(TodosService);

        search = new URLSearchParams();
        component.session.g.set('school', mockSchool);
        search.append('school_id', component.session.g.get('school').id.toString());

        component.todo = {
          id: 55,
          title: 'Hello World!',
          end: 1515625016,
          description: 'test description'
        };
        component.ngOnInit();
      });
  }));

  it('form validation - should pass', () => {
    expect(component.form.valid).toBeTruthy();
  });

  it('form validation - should fail', () => {
    component.form.controls['title'].setValue(null);
    component.form.controls['end'].setValue(null);
    expect(component.form.valid).toBeFalsy();
  });

  it('form validation - max length 225 - should fail', () => {
    const charCount226 = 'a'.repeat(226);

    component.form.controls['title'].setValue(charCount226);
    component.form.controls['end'].setValue(1515625016);
    expect(component.form.valid).toBeFalsy();
  });

  it('cp button should have disabled state TRUE', () => {
    component.form.controls['title'].setValue(null);
    component.form.controls['end'].setValue(null);
    expect(component.buttonData.disabled).toBeTruthy();
  });

  it('cp button should have disabled state FALSE', () => {
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should update todo', () => {
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'editTodo').and.returnValue(Observable.of({}));

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(1);
  });

});