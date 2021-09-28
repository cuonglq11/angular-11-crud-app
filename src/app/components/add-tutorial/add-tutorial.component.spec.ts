import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { clickByInnerHTML, getInputValueById } from 'src/app/common/test-utils';
import { TutorialService } from 'src/app/services/tutorial.service';

import { AddTutorialComponent } from './add-tutorial.component';

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let el: DebugElement
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['create'])

  const mockData = { "title": "new title", "description": "new description" }

  beforeEach(async () => {
    tutorialServiceSpy.create.and.returnValue(of(mockData))

    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AddTutorialComponent],
      providers: [
        { provide: TutorialService, useValue: tutorialServiceSpy },
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTutorialComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should empty form when click add new tutorial', () => {
    // given
    component.submitted = true

    fixture.detectChanges()

    clickByInnerHTML(el, 'button', 'Add')

    // then
    expect(component.submitted).toBeFalse()
    expect(component.tutorial.title).toBeFalsy()
    expect(component.tutorial.description).toBeFalsy()
    expect(component.tutorial.published).toBeFalse()
  })

  it('should create when click create new tutorial', fakeAsync(() => {
    // given
    component.tutorial.title = mockData.title
    component.tutorial.description = mockData.description
    fixture.detectChanges()

    flush()

    clickByInnerHTML(el, 'button', 'Submit')

    // then
    expect(component.submitted).toBeTrue()
    expect(tutorialServiceSpy.create).toHaveBeenCalledWith(mockData)
    expect(getInputValueById(el, '#title')).toEqual(mockData.title)
    expect(getInputValueById(el, '#description')).toEqual(mockData.description)
  }))
});
