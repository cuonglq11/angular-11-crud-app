import { DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AppModule } from "src/app/app.module";
import { clickByInnerHTML, getInputValueById, getNativeElByCss } from "src/app/common/test-utils";
import { TutorialService } from "src/app/services/tutorial.service";
import { TUTORIALS } from "src/app/test-data/db-data";
import { TutorialDetailsComponent } from "./tutorial-details.component";

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent;
  let fixture: ComponentFixture<TutorialDetailsComponent>;
  let el: DebugElement
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['get', 'update', 'delete'])
  const routerSpy = { navigate: jasmine.createSpy('navigate') }

  const mockData = {
    "title": "Product Intranet Executive11111",
    "description": "Officiis inventore quae",
    "published": true,
    "id": "2"
  }

  const resData = {
    title: 'new title',
    description: 'new desc',
    published: false
  }

  beforeEach(async () => {
    tutorialServiceSpy.get.and.returnValue(of({...mockData}))
    tutorialServiceSpy.update.and.returnValue(of({...resData}))
    tutorialServiceSpy.delete.and.returnValue(of({...TUTORIALS[0]}))

    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule, NoopAnimationsModule],
      declarations: [TutorialDetailsComponent],
      providers: [
        { provide: TutorialService, useValue: tutorialServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '2' } }
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()
  })

  beforeEach(async () => {
    fixture = TestBed.createComponent(TutorialDetailsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement

    component.ngOnInit()
    fixture.detectChanges()
  })

  afterEach(() => {
    fixture.destroy()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show tutorial with id = 2', () => {
    expect(component.currentTutorial).toEqual(mockData)
    expect(component.message).toBeFalsy()
    expect(getNativeElByCss(el, '#title').value).toEqual('Product Intranet Executive11111')
    expect(getNativeElByCss(el, '#description').value).toEqual('Officiis inventore quae')
  })

  it('should update unpublish the tutorial', () => {
    component.currentTutorial.published = true
    fixture.detectChanges()

    const sendData = {
      title: mockData.title,
      description: mockData.description,
      published: false
    }

    clickByInnerHTML(el, 'button', 'UnPublish')

    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, sendData)
    expect(component.currentTutorial.published).toBeFalse()
  })

  it('should update publish the tutorial', () => {
    component.currentTutorial.published = false
    fixture.detectChanges()

    const sendData = {
      title: mockData.title,
      description: mockData.description,
      published: true
    }

    clickByInnerHTML(el, 'button', 'Publish')

    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, sendData)
    expect(component.currentTutorial.published).toBeTrue()
  })

  it('should update details of the tutorial', fakeAsync(() => {
    component.currentTutorial.title = resData.title
    component.currentTutorial.description = resData.description
    component.currentTutorial.published = resData.published
    fixture.detectChanges()
    tick()

    expect(getInputValueById(el, '#title')).toEqual(resData.title)
    expect(getInputValueById(el, '#description')).toEqual(resData.description)
    expect(component.currentTutorial.published).toBeFalse()

    clickByInnerHTML(el, 'button', 'Update')
    tick()
    fixture.detectChanges()

    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, component.currentTutorial)
  }))

  it('should delete the tutorial', () => {
    clickByInnerHTML(el, 'button', 'Delete')

    expect(component.message).toBeFalsy()
    expect(tutorialServiceSpy.delete).toHaveBeenCalledWith(component.currentTutorial.id)
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tutorials'])
  })
})
