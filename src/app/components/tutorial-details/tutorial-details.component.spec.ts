import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { click } from 'src/app/common/test-utils';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TUTORIALS } from 'src/app/test-data/db-data';

import { TutorialDetailsComponent } from './tutorial-details.component';

describe('TutorialDetailsComponent', () => {
  let component: TutorialDetailsComponent
  let fixture: ComponentFixture<TutorialDetailsComponent>
  let el: DebugElement
  let tutorialService: any
  let activatedRoute: any
  let router: any

  let mockData: Tutorial

  beforeEach(waitForAsync(() => {
    const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['get', 'update', 'delete'])
    const routerSpy = { navigate: jasmine.createSpy('navigate') }

    TestBed.configureTestingModule({
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
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TutorialDetailsComponent)
        component = fixture.componentInstance
        el = fixture.debugElement
        tutorialService = TestBed.inject(TutorialService)
        activatedRoute = TestBed.inject(ActivatedRoute)
        router = TestBed.inject(Router)
      })
  }))

  beforeEach(() => {
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
    tutorialService.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    // then
    expect(component.currentTutorial).toEqual(mockData)
    expect(component.message).toBeFalsy()
  })

  it('should update publish the tutorial', () => {
    // given
    tutorialService.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    const data = {
      title: 'new title',
      description: 'new desc',
      published: false
    }

    tutorialService.update.and.returnValue(of(data))

    const publishBtn = el.query(By.css('.badge.badge-primary.mr-2'))

    click(publishBtn)

    component.currentTutorial = {...mockData, ...data}

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(component.currentTutorial.title).toEqual(data.title)
    expect(component.currentTutorial.description).toEqual(data.description)
    expect(component.currentTutorial.published).toEqual(data.published)
  })

  it('should update details of the tutorial', () => {
    // given
    tutorialService.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    const data = {
      title: 'new title',
      description: 'new desc',
      published: false
    }

    tutorialService.update.and.returnValue(of(data))

    const updateBtn = el.query(By.css('.badge.badge-success.mb-2'))

    click(updateBtn)

    component.currentTutorial = {...mockData, ...data}

    // then
    expect(component.message).toEqual('This tutorial was updated successfully!')
    expect(component.currentTutorial.title).toEqual(data.title)
    expect(component.currentTutorial.description).toEqual(data.description)
    expect(component.currentTutorial.published).toEqual(data.published)
  })

  it('should delete the tutorial', () => {
    // given
    tutorialService.get.and.returnValue(of(mockData))
    fixture.detectChanges()

    tutorialService.delete.and.returnValue(of(TUTORIALS[0]))

    const deleteBtn = el.query(By.css('.badge.badge-danger.mr-2'))

    click(deleteBtn)

    // then
    expect(component.message).toBeFalsy()
    expect(router.navigate).toHaveBeenCalledWith(['/tutorials'])
  })
});
