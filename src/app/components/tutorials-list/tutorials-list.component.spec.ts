import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { click, clickByInnerHTML } from 'src/app/common/test-utils';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TUTORIALS } from 'src/app/test-data/db-data';

import { TutorialsListComponent } from './tutorials-list.component';

describe('TutorialsListComponent', () => {
  let component: TutorialsListComponent;
  let fixture: ComponentFixture<TutorialsListComponent>;
  let el: DebugElement
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['getAll', 'findByTitle'])

  let filteredData = [{
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

    tutorialServiceSpy.getAll.and.returnValue(of(TUTORIALS))
    tutorialServiceSpy.findByTitle.and.returnValue(of(filteredData))
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tutorials list', () => {
    const items = el.queryAll(By.css('.list-group-item'))

    expect(items.length).toBe(10, 'Unexpected number of tutorials found')
  })

  it('should active after clicking', () => {
    // given
    const items = el.queryAll(By.css('.list-group-item'))

    click(items[0])

    fixture.detectChanges()

    const clickedItem = el.query(By.css('.list-group-item.active'))

    // then
    expect(clickedItem).toBe(items[0])
    expect(component.currentTutorial).toBe(TUTORIALS[0], 'Wrong current tutorial data')
  })

  it('should return data when finding', () => {
    // given
    component.title = 'in'

    fixture.detectChanges()

    clickByInnerHTML(el, 'button', 'Search')

    fixture.detectChanges()

    const items = el.queryAll(By.css('.list-group-item'))

    // then
    expect(tutorialServiceSpy.findByTitle).toHaveBeenCalledWith(component.title)
    expect(items.length).toBe(2, 'Unexpected number of tutorials found')
    expect(items[0].nativeElement.textContent.trim()).toBe('Product Intranet Executive11111', 'Wrong title data item - 0')
    expect(items[1].nativeElement.textContent.trim()).toBe('Investor Interactions Consultant', 'Wrong title data item - 1')
  })
});
