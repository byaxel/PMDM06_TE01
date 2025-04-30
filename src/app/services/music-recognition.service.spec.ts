import { TestBed } from '@angular/core/testing';

import { MusicRecognitionService } from './music-recognition.service';

describe('MusicRecognitionService', () => {
  let service: MusicRecognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicRecognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
