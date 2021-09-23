import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { click } from 'src/app/common/test-utils';
import { TutorialService } from 'src/app/services/tutorial.service';

import { AddTutorialComponent } from './add-tutorial.component';

describe('AddTutorialComponent', () => {
  let component: AddTutorialComponent;
  let fixture: ComponentFixture<AddTutorialComponent>;
  let el: DebugElement
  let tutorialService: any

  beforeEach(waitForAsync(() => {
    const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['create'])

    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ AddTutorialComponent ],
      providers: [
        { provide: TutorialService, useValue: tutorialServiceSpy },
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AddTutorialComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement
      tutorialService = TestBed.inject(TutorialService)
    })
  }))

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should empty form when click add new tutorial', () => {
    // given
    component.newTutorial()
    fixture.detectChanges()

    // then
    expect(component.submitted).toBeFalse()
    expect(component.tutorial.title).toBeFalsy()
    expect(component.tutorial.description).toBeFalsy
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

    tutorialService.create.and.returnValue(of(mockData))

    const submitBtn = el.query(By.css('.btn.btn-success'))
    click(submitBtn)

    // then
    expect(component.submitted).toBeTrue()
  })
});
