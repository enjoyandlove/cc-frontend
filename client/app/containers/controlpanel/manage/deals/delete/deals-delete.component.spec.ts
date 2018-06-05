import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';

import { DealsModule } from '../deals.module';
import { DealsService } from '../deals.service';
import { CPSession } from '../../../../../session';
import { DealsDeleteComponent } from './deals-delete.component';
import { CPI18nService } from '../../../../../shared/services';
import { mockSchool } from '../../../../../session/mock/school';

class MockDealsService {
  dummy;

  deleteDeal(id: number, search: any) {
    this.dummy = [id, search];

    return Observable.of({});
  }
}

describe('DealsDeleteComponent', () => {
  let spy;
  let search;
  let component: DealsDeleteComponent;
  let fixture: ComponentFixture<DealsDeleteComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [DealsModule, RouterTestingModule],
        providers: [
          CPSession,
          CPI18nService,
          { provide: DealsService, useClass: MockDealsService },
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DealsDeleteComponent);
          component = fixture.componentInstance;

          search = new URLSearchParams();
          component.deal = {
            id: 1,
            store_id: 10,
            title: 'Hello World!',
            start: 0,
            expiration: 0,
            image_url: 'dummy.jpeg',
            image_thumb_url: 'dummy.jpeg',
            description: 'This is description'
          };

          component.session.g.set('school', mockSchool);
          search.append('school_id', component.session.g.get('school').id.toString());
        });
    })
  );

  it('buttonData should have "Delete" label & "Danger class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Delete');
    expect(component.buttonData.class).toEqual('danger');
  });

  it('should delete deal', () => {
    spyOn(component.deleted, 'emit');
    spyOn(component.resetDeleteModal, 'emit');
    spy = spyOn(component.service, 'deleteDeal').and.returnValue(Observable.of({}));

    component.onDelete();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.deal.id, search);

    expect(component.deleted.emit).toHaveBeenCalledTimes(1);
    expect(component.deleted.emit).toHaveBeenCalledWith(component.deal.id);

    expect(component.resetDeleteModal.emit).toHaveBeenCalled();
    expect(component.resetDeleteModal.emit).toHaveBeenCalledTimes(1);
  });

});