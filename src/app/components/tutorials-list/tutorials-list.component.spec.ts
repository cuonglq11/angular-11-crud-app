import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppModule } from 'src/app/app.module';
import { click, clickByInnerHTML, getAllListByCss, getDebugElByCss } from 'src/app/common/test-utils';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TUTORIALS } from 'src/app/test-data/db-data';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

import { TutorialsListComponent } from './tutorials-list.component';

describe('TutorialsListComponent', () => {
  let component: TutorialsListComponent;
  let fixture: ComponentFixture<TutorialsListComponent>;
  let el: DebugElement
  const tutorialServiceSpy = jasmine.createSpyObj('TutorialService', ['getAll', 'findByTitle'])

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

  beforeEach(async () => {
    tutorialServiceSpy.getAll.and.returnValue(of(TUTORIALS))
    tutorialServiceSpy.findByTitle.and.returnValue(of(filteredData))

    await TestBed.configureTestingModule({
      imports: [
        AppModule, NoopAnimationsModule
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
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tutorials list', () => {
    const items = getAllListByCss(el, '.list-group-item')

    expect(items.length).toBe(10, 'Unexpected number of tutorials found')
  })

  it('should active after clicking', fakeAsync(() => {
    const items = getAllListByCss(el, '.list-group-item')

    click(items[0])

    tick()

    fixture.detectChanges()

    const clickedItem = getDebugElByCss(el, '.list-group-item.active')

    expect(clickedItem).toBe(items[0])
    expect(component.currentTutorial).toBe(TUTORIALS[0], 'Wrong current tutorial data')
  }))

  it('should return data when finding', fakeAsync(() => {
    component.title = 'in'

    fixture.detectChanges()

    clickByInnerHTML(el, 'button', 'Search')

    tick()

    fixture.detectChanges()

    const items = getAllListByCss(el, '.list-group-item')

    expect(tutorialServiceSpy.findByTitle).toHaveBeenCalledWith(component.title)
    expect(items.length).toBe(2, 'Unexpected number of tutorials found')
    expect(items[0].nativeElement.textContent.trim()).toBe('Product Intranet Executive11111', 'Wrong title data item - 0')
    expect(items[1].nativeElement.textContent.trim()).toBe('Investor Interactions Consultant', 'Wrong title data item - 1')
  }))
});
