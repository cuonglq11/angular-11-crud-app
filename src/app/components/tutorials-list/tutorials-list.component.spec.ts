import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TUTORIALS } from 'src/app/test-data/db-data';

import { TutorialsListComponent } from './tutorials-list.component';

describe('TutorialsListComponent', () => {
  let component: TutorialsListComponent;
  let fixture: ComponentFixture<TutorialsListComponent>;
  let el: DebugElement
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['getAll', 'findByTitle'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule
      ],
      declarations: [
        TutorialsListComponent
      ],
      providers: [
        {provide: TutorialService, useValue: tutorialServiceSpy}
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialsListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tutorials list', () => {
    tutorialServiceSpy.getAll.and.returnValue(of(TUTORIALS))

    fixture.detectChanges()

    const items = el.queryAll(By.css('.list-group-item'))

    expect(items.length).toBe(10, 'Unexpected number of tutorials found')
  })

  it('should active after clicking', fakeAsync(() => {
    // given
    tutorialServiceSpy.getAll.and.returnValue(of(TUTORIALS))

    fixture.detectChanges()

    const items = el.queryAll(By.css('.list-group-item'))

    items[0].triggerEventHandler('click', null)

    fixture.detectChanges()

    flush()

    const clickedItem = el.query(By.css('.list-group-item.active'))

    // then
    expect(clickedItem).toBe(items[0])

    expect(component.currentTutorial).toBe(TUTORIALS[0], 'Wrong current tutorial data')
  }))

  it('should return data when finding', fakeAsync(() => {
    // given
    tutorialServiceSpy.getAll.and.returnValue(of(TUTORIALS))

    fixture.detectChanges()

    component.title = 'in'

    fixture.detectChanges()

    const filteredData = [{
      "title": "Product Intranet Executive11111",
      "description": "Officiis inventore quae.\nAt necessitatibus voluptas deleniti expedita.\nUt nesciunt quidem sunt.\nRepellat sunt tempora impedit omnis eveniet enim.",
      "published": true,
      "id": "2"
    },
    {
      "title": "Investor Interactions Consultant",
      "description": "maiores1111111",
      "published": true,
      "id": "3"
    }]

    tutorialServiceSpy.findByTitle.and.returnValue(of(filteredData))

    const submitBtn = el.queryAll(By.css('button')).find(el => el.nativeElement.innerHTML.trim() === 'Search')
    submitBtn?.triggerEventHandler('click', null)

    fixture.detectChanges()

    const items = el.queryAll(By.css('.list-group-item'))
    console.log('filteredData ==> ', items)

    // then
    expect(tutorialServiceSpy.findByTitle).toHaveBeenCalledWith(component.title)
    expect(items.length).toBe(2, 'Unexpected number of tutorials found')
    expect(items[0].nativeElement.textContent.trim()).toBe('Product Intranet Executive11111', 'Wrong title data item - 0')
    expect(items[1].nativeElement.textContent.trim()).toBe('Investor Interactions Consultant', 'Wrong title data item - 1')
  }))
});
