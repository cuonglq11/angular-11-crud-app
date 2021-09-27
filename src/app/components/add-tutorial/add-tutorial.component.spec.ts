import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { clickByInnerHTML } from 'src/app/common/test-utils';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

import { AddTutorialComponent } from './add-tutorial.component';

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let el: DebugElement
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['create'])

  let mockData: Tutorial

  beforeEach(async () => {
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

    mockData = {
      "title": "new title",
      "description": "new description"
    }

    tutorialServiceSpy.create.and.returnValue(of(mockData))
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should empty form when click add new tutorial', () => {
    // given
    component.submitted = true

    fixture.detectChanges()

    clickByInnerHTML(el, '.btn.btn-success', 'Add')

    // then
    expect(component.submitted).toBeFalse()
    expect(component.tutorial.title).toBeFalsy()
    expect(component.tutorial.description).toBeFalsy()
    expect(component.tutorial.published).toBeFalse()
  })

  it('should create when click create new tutorial', () => {
    // given
    component.tutorial.title = mockData.title
    component.tutorial.description = mockData.description

    fixture.detectChanges()

    clickByInnerHTML(el, '.btn.btn-success', 'Submit')

    // then
    expect(component.submitted).toBeTrue()
    expect(tutorialServiceSpy.create).toHaveBeenCalledWith(mockData)
  })
});
