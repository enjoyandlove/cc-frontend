import { CampusLink } from '@controlpanel/manage/links/tile';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { mockSchool } from '@client/app/session/mock';
import { SharedModule } from '@client/app/shared/shared.module';
import { ContentUtilsProviders } from './../../providers/content.utils.providers';
import { ResourceTypeServiceByCategoryComponent } from './../resource-type-service-by-category';
import { ResourceSelectorTypeResourceComponent } from './resource-selector-type-resource.component';

describe('ResourceSelectorTypeResourceComponent', () => {
  let session: CPSession;
  let component: ResourceSelectorTypeResourceComponent;
  let fixture: ComponentFixture<ResourceSelectorTypeResourceComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule],
        providers: [CPSession, CPI18nService, ContentUtilsProviders],
        declarations: [
          ResourceSelectorTypeResourceComponent,
          ResourceTypeServiceByCategoryComponent
        ]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSelectorTypeResourceComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct outputs', () => {
    expect(component.valueChanges).toBeDefined();
  });

  it('should have correct default input values', () => {
    expect(component.isEdit).toBe(false);
    expect(component.filterByWebApp).toBe(false);
    expect(component.filterByLoginStatus).toBe(false);
  });

  it('should create an empty form', () => {
    component.buildForm();

    fixture.detectChanges();

    const expected = { link_url: null, link_params: {} };

    expect(component.form.value).toEqual(expected);
  });

  describe('ngOnInit', () => {
    it('should call buildForm', () => {
      spyOn(component, 'buildForm');

      component.ngOnInit();

      expect(component.form).toBeDefined();
      expect(component.buildForm).toHaveBeenCalled();
    });

    it('should call updateState when isEdit is true', () => {
      spyOn(component, 'updateState');

      component.isEdit = true;
      fixture.detectChanges();

      component.ngOnInit();

      expect(component.updateState).toHaveBeenCalled();
    });

    describe('valueChanges', () => {
      let valueChangesSpy: jasmine.Spy;

      beforeEach(() => {
        valueChangesSpy = spyOn(component.valueChanges, 'emit');
        component.ngOnInit();

        valueChangesSpy.calls.reset();
      });

      it('should emit form value, when form is valid', () => {
        component.form.patchValue({ link_params: {}, link_url: CampusLink.campusPoi });

        expect(valueChangesSpy).toHaveBeenCalledWith(component.form.value);
      });

      it('should emit {link_url: null}, when form is invalid', () => {
        component.form.patchValue({ link_url: null });

        expect(valueChangesSpy).toHaveBeenCalledWith({ link_url: null });
      });
    });

    it('should set correct fiters based on filterByWebApp, filterByLoginStatus', () => {
      component.filterByWebApp = true;
      component.filterByLoginStatus = true;

      const getResourcesForTypeSpy: jasmine.Spy = spyOn(
        ContentUtilsProviders,
        'getResourcesForType'
      );

      component.ngOnInit();
      const [name, validators] = getResourcesForTypeSpy.calls.mostRecent().args;

      expect(validators.length).toBe(2);
      expect(name).toEqual(ContentUtilsProviders.contentTypes.list);

      const webAppFilter = validators.find((v) => v === ContentUtilsProviders.isWebAppContent);
      const loginRequiredFilter = validators.find(
        (v) => v === ContentUtilsProviders.isWebAppContent
      );

      expect(webAppFilter).toBeDefined();
      expect(loginRequiredFilter).toBeDefined();
    });

    it('should set form to invalid when link params is empty when required', () => {
      expect(component.form.valid).toBe(false);

      component.resourcesWithLinkParamsRequired.forEach((resource) => {
        component.form.patchValue({ link_url: resource });
        component.form.patchValue({ link_params: {} });

        expect(component.form.valid).toBe(false);
      });
    });

    it('should set correct resources based on filterByWebApp, filterByLoginStatus', () => {
      component.filterByWebApp = true;
      component.filterByLoginStatus = true;

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.resources.length).toBe(1);

      component.filterByWebApp = false;
      component.filterByLoginStatus = false;

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(14);

      component.filterByWebApp = true;
      component.filterByLoginStatus = false;

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(8);

      component.filterByWebApp = false;
      component.filterByLoginStatus = true;

      fixture.detectChanges();
      component.ngOnInit();

      expect(component.resources).toBeDefined();
      expect(component.resources.length).toBe(5);
    });
  });
});