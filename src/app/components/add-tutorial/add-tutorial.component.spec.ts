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
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['create'])

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
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should empty form when click add new tutorial', () => {
    // given
    component.submitted = true

    fixture.detectChanges()

    const submitBtn = el.queryAll(By.css('.btn.btn-success')).find(el => el.nativeElement.innerHTML.trim() === 'Add')
    submitBtn?.triggerEventHandler('click', null)

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
    console.log('component ==> ', el.nativeElement.outerHTML)
    tutorialServiceSpy.create.and.returnValue(of(mockData))

    const submitBtn = el.queryAll(By.css('.btn.btn-success')).find(el => el.nativeElement.innerHTML.trim() === 'Submit')
    submitBtn?.triggerEventHandler('click', null)

    // then
    expect(component.submitted).toBeTrue()
    expect(tutorialServiceSpy.create).toHaveBeenCalledWith(mockData)
  })
});
