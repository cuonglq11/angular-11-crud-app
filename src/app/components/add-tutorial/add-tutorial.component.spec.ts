import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { TutorialService } from 'src/app/services/tutorial.service';

import { AddTutorialComponent } from './add-tutorial.component';

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let el: DebugElement
  let tutorialService: TutorialService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AddTutorialComponent],
      providers: [
        TutorialService
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTutorialComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement
    tutorialService = TestBed.inject(TutorialService)
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should empty form when click add new tutorial', () => {
    // given
    component.submitted = true

    fixture.detectChanges()

    const addBtn = el.nativeElement.querySelector('button[id="add-btn"]')

    addBtn.click()

    // then
    expect(component.submitted).toBeFalse()
    expect(component.tutorial.title).toBeFalsy()
    expect(component.tutorial.description).toBeFalsy()
    expect(component.tutorial.published).toBeFalse()
  })

  it('should create when click create new tutorial', () => {
    // given
    const mockData = {
      "title": "new title",
      "description": "new description"
    }

    component.tutorial.title = mockData.title
    component.tutorial.description = mockData.description

    fixture.detectChanges()

    const submitSpy = spyOn(tutorialService, 'create').and.returnValue(of(mockData))

    const submitBtn = el.nativeElement.querySelector('button[id="submit-btn"]')

    submitBtn.click()

    // then
    expect(component.submitted).toBeTrue()
    expect(submitSpy).toHaveBeenCalledWith(mockData)
  })
});
