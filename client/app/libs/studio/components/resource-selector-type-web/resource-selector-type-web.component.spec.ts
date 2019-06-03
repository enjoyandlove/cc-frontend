import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { ResourceSelectorTypeWebComponent } from './resource-selector-type-web.component';

describe('ResourceSelectorTypeWebComponent', () => {
  let component: ResourceSelectorTypeWebComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeWebComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [CPI18nService],
        imports: [ReactiveFormsModule, SharedModule],
        declarations: [ResourceSelectorTypeWebComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorTypeWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form', () => {
    const expected = {
      link_url: '',
      link_params: {},
      open_in_browser: null
    };

    expect(component.form.value).toEqual(expected);
  });

  describe('ngOnInit', () => {
    let buildFormSpy: jasmine.Spy;

    beforeEach(() => {
      buildFormSpy = spyOn(component, 'buildForm');
      component.ngOnInit();
    });

    it('should set resources', () => {
      expect(component.items).toBeDefined();
      expect(component.items.length).toBe(3);
      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(2);
    });

    it('should call buildForm', () => {
      expect(buildFormSpy).toHaveBeenCalled();
    });

    describe('valueChanges', () => {
      it('should emit form value when valid', () => {
        const valueChangesSpy = spyOn(component.valueChanges, 'emit');
        const validForm = {
          link_url: 'http://google.com',
          open_in_browser: 0
        };

        component.form.patchValue(validForm);

        expect(valueChangesSpy).toHaveBeenCalledWith(component.form.value);
      });

      it('should emit form value when invalid', () => {
        const valueChangesSpy = spyOn(component.valueChanges, 'emit');
        const invalidForm = {
          link_url: null,
          open_in_browser: 0
        };

        component.form.patchValue(invalidForm);

        expect(valueChangesSpy).toHaveBeenCalledWith({
          link_url: '',
          link_params: {}
        });
      });
    });
  });

  describe('onItemSelected', () => {
    it('should set form to pristine', () => {
      component.onItemSelected({ id: null });
      expect(component.form.pristine).toBe(true);
    });

    it('should set showForm value based on selection id', () => {
      component.onItemSelected({ id: null });
      expect(component.showForm).toBe(false);

      component.onItemSelected({ id: 1, meta: { open_in_browser: 1 } });
      expect(component.showForm).toBe(true);
    });

    it('should update form with new values', () => {
      {
        component.onItemSelected({ id: null });
        const { link_url, open_in_browser } = component.form.value;

        expect(link_url).toBe('');
        expect(open_in_browser).toBeNull();
      }

      {
        component.onItemSelected({ id: 1, meta: { open_in_browser: 1 } });
        const { link_url, open_in_browser } = component.form.value;

        expect(link_url).toBe('');
        expect(open_in_browser).toBe(1);
      }
    });
  });
});