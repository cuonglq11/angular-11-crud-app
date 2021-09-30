import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { TutorialService } from './tutorial.service';
import { TUTORIALS } from '../test-data/db-data';

describe('TutorialService', () => {
  let service: TutorialService,
      httpTestingController: HttpTestingController,
      baseUrl = 'https://614ad4da07549f001755aa54.mockapi.io/tutorials'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        TutorialService
      ]
    });
    service = TestBed.inject(TutorialService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tutorial', () => {
    service.getAll().subscribe(items => {
      expect(items).toBeTruthy('No tutorials returned');
      expect(items.length).toBe(10, 'Incorrect number of tutorials');
      expect(items).toBe(TUTORIALS)
    })

    const req = httpTestingController.expectOne(baseUrl)
    expect(req.request.method).toEqual('GET')
    req.flush(TUTORIALS)
  })

  it('should get tutorial with id = 2', () => {
    const mockData = {
      "title": "Product Intranet Executive11111",
      "description": "Officiis inventore quae.\nAt necessitatibus voluptas deleniti expedita.\nUt nesciunt quidem sunt.\nRepellat sunt tempora impedit omnis eveniet enim.",
      "published": true,
      "id": "2"
    }

    service.get(2).subscribe(item => {
      expect(item).toBeTruthy('No tutorials returned');
      expect(item).toBe(mockData, 'Wrong data')
    })

    const req = httpTestingController.expectOne(baseUrl + '/2')
    expect(req.request.method).toEqual('GET')
    req.flush(mockData)
  })

  it('should create tutorial', () => {
    const mockData = {
      "title": "Product Intranet blahblah",
      "description": "blahblah omnis eveniet enim.",
      "published": true,
      "id": "999"
    }

    service.create(mockData).subscribe(item => {
      expect(item).toBeTruthy('No tutorials returned');
      expect(item).toBe(mockData, 'Wrong data')
    })

    const req = httpTestingController.expectOne(baseUrl)
    expect(req.request.method).toEqual('POST')
    req.flush(mockData)
  })

  it('should update tutorial', () => {
    const mockData = {
      "description": "blahblah blobvjojbjojob.",
      "published": false
    }

    service.update(2, mockData).subscribe(item => {
      expect(item).toBeTruthy('No tutorials returned');
      expect(item.description).toBe(mockData.description, 'Wrong description data')
      expect(item.published).toBe(mockData.published, 'Wrong published data')
    })

    const req = httpTestingController.expectOne(baseUrl + '/2')
    expect(req.request.method).toEqual('PUT')
    req.flush(mockData)
  })

  it('should delete tutorial', () => {
    const mockData = {
      "description": "blahblah blobvjojbjojob.",
      "published": false
    }

    service.delete(2).subscribe(item => {
      expect(item).toBeTruthy('No tutorials returned');
      expect(item).toBe(mockData, 'Wrong data')
    })

    const req = httpTestingController.expectOne(baseUrl + '/2')
    expect(req.request.method).toEqual('DELETE')
    req.flush(mockData)
  })

  it('should find tutorial by title', () => {
    const mockData = [{
      "title": "Product Intranet Executive11111",
      "description": "Officiis inventore quae.\nAt necessitatibus voluptas deleniti expedita.\nUt nesciunt quidem sunt.\nRepellat sunt tempora impedit omnis eveniet enim.",
      "published": true,
      "id": "2"
    }]

    service.findByTitle('Executive11111').subscribe(items => {
      expect(items).toBeTruthy('No tutorials returned');
      expect(items.length).toBe(1, 'Incorrect number of tutorials');
    })

    const req = httpTestingController.expectOne(baseUrl + '?title=Executive11111')
    expect(req.request.method).toEqual('GET')
    req.flush(mockData)
  })
});
