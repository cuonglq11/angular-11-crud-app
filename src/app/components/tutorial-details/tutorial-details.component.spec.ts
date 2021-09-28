import { DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AppModule } from "src/app/app.module";
import { clickByInnerHTML, getInputValueById } from "src/app/common/test-utils";
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
    "description": "Officiis inventore quae.\nAt necessitatibus voluptas deleniti expedita.\nUt nesciunt quidem sunt.\nRepellat sunt tempora impedit omnis eveniet enim.",
    "published": true,
    "id": "2"
  }

  const resData = {
    title: 'new title',
    description: 'new desc',
    published: false
  }

  beforeEach(async () => {
    tutorialServiceSpy.get.and.returnValue(of(mockData))
    tutorialServiceSpy.update.and.returnValue(of(resData))
    tutorialServiceSpy.delete.and.returnValue(of(TUTORIALS[0]))

    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
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

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialDetailsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show tutorial with id = 2', () => {
    expect(component.currentTutorial).toEqual(mockData)
    expect(component.message).toBeFalsy()
  })

  it('should update unpublish the tutorial', () => {
    // given
    component.currentTutorial.published = true
    fixture.detectChanges()

    const sendData = {
      title: mockData.title,
      description: mockData.description,
      published: false
    }

    clickByInnerHTML(el, 'button', 'UnPublish')

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, sendData)
    expect(component.currentTutorial.published).toBeFalse()
  })

  it('should update publish the tutorial', () => {
    // given
    component.currentTutorial.published = false
    fixture.detectChanges()

    const sendData = {
      title: mockData.title,
      description: mockData.description,
      published: true
    }

    clickByInnerHTML(el, 'button', 'Publish')

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, sendData)
    expect(component.currentTutorial.published).toBeTrue()
  })

  it('should update details of the tutorial', fakeAsync(() => {
    // given
    component.currentTutorial.title = resData.title
    component.currentTutorial.description = resData.description
    component.currentTutorial.published = resData.published
    fixture.detectChanges()

    tick(100000000)
    console.log('tick 100000')
    // flush()
    // console.log('flush')

    clickByInnerHTML(el, 'button', 'Update')

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, component.currentTutorial)
    expect(getInputValueById(el, '#title')).toEqual(resData.title)
    expect(getInputValueById(el, '#description')).toEqual(resData.description)
    expect(component.currentTutorial.published).toBeFalse()
  }))

  it('should delete the tutorial', () => {
    // given
    clickByInnerHTML(el, 'button', 'Delete')

    // then
    expect(component.message).toBeFalsy()
    expect(tutorialServiceSpy.delete).toHaveBeenCalledWith(component.currentTutorial.id)
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tutorials'])
  })
})
