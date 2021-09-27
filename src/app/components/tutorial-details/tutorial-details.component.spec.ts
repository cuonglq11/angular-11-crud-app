import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TUTORIALS } from 'src/app/test-data/db-data';

import { TutorialDetailsComponent } from './tutorial-details.component';

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent
  let fixture: ComponentFixture<TutorialDetailsComponent>
  let el: DebugElement
  let activatedRoute: ActivatedRoute
  let router: Router
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['get', 'update', 'delete'])

  let mockData: Tutorial

  beforeEach(async () => {
    const routerSpy = { navigate: jasmine.createSpy('navigate') }

    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule
      ],
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
    fixture = TestBed.createComponent(TutorialDetailsComponent)
    component = fixture.componentInstance
    el = fixture.debugElement
    activatedRoute = TestBed.inject(ActivatedRoute)
    router = TestBed.inject(Router)

    mockData = {
      "title": "Product Intranet Executive11111",
      "description": "Officiis inventore quae.\nAt necessitatibus voluptas deleniti expedita.\nUt nesciunt quidem sunt.\nRepellat sunt tempora impedit omnis eveniet enim.",
      "published": true,
      "id": "2"
    }
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tutorial with id = 2', () => {
    // given
    tutorialServiceSpy.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    // then
    expect(component.currentTutorial).toEqual(mockData)
    expect(component.message).toBeFalsy()
  })

  it('should update unpublish the tutorial', () => {
    // given
    tutorialServiceSpy.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    const data = {
      title: 'new title',
      description: 'new desc',
      published: false
    }

    component.currentTutorial.title = data.title
    component.currentTutorial.description = data.description
    fixture.detectChanges()

    tutorialServiceSpy.update.and.returnValue(of(data))

    const submitBtn = el.queryAll(By.css('button')).find(el => el.nativeElement.innerHTML.trim() === 'UnPublish')
    submitBtn!.triggerEventHandler('click', null)

    component.currentTutorial = {...mockData, ...data}

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, data)
    expect(component.currentTutorial.title).toEqual(data.title)
    expect(component.currentTutorial.description).toEqual(data.description)
    expect(component.currentTutorial.published).toEqual(data.published)
  })

  it('should update publish the tutorial', () => {
    // given
    mockData.published = false
    tutorialServiceSpy.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    const data = {
      title: 'new title',
      description: 'new desc',
      published: true
    }

    component.currentTutorial.title = data.title
    component.currentTutorial.description = data.description
    fixture.detectChanges()

    tutorialServiceSpy.update.and.returnValue(of(data))

    const submitBtn = el.queryAll(By.css('button')).find(el => el.nativeElement.innerHTML.trim() === 'Publish')
    submitBtn!.triggerEventHandler('click', null)

    component.currentTutorial = {...mockData, ...data}

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, data)
    expect(component.currentTutorial.title).toEqual(data.title)
    expect(component.currentTutorial.description).toEqual(data.description)
    expect(component.currentTutorial.published).toEqual(data.published)
  })

  it('should update details of the tutorial', () => {
    // given
    tutorialServiceSpy.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    const data = {
      title: 'new title',
      description: 'new desc',
      published: false
    }

    component.currentTutorial.title = data.title
    component.currentTutorial.description = data.description
    component.currentTutorial.published = data.published
    fixture.detectChanges()

    tutorialServiceSpy.update.and.returnValue(of(data))

    const submitBtn = el.queryAll(By.css('button')).find(el => el.nativeElement.innerHTML.trim() === 'Update')
    submitBtn!.triggerEventHandler('click', null)

    component.currentTutorial = {...mockData, ...data}

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(tutorialServiceSpy.update).toHaveBeenCalledWith(component.currentTutorial.id, component.currentTutorial)
    expect(component.currentTutorial.title).toEqual(data.title)
    expect(component.currentTutorial.description).toEqual(data.description)
    expect(component.currentTutorial.published).toEqual(data.published)
  })

  it('should delete the tutorial', () => {
    // given
    tutorialServiceSpy.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    tutorialServiceSpy.delete.and.returnValue(of(TUTORIALS[0]))

    const submitBtn = el.queryAll(By.css('button')).find(el => el.nativeElement.innerHTML.trim() === 'Delete')
    submitBtn!.triggerEventHandler('click', null)

    // then
    expect(component.message).toBeFalsy()
    expect(tutorialServiceSpy.delete).toHaveBeenCalledWith(component.currentTutorial.id)
    expect(router.navigate).toHaveBeenCalledWith(['/tutorials'])
  })
});
