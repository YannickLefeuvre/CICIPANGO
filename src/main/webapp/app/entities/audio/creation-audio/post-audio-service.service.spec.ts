import { TestBed } from '@angular/core/testing';

import { PostAudioServiceService } from './post-audio-service.service';

describe('PostAudioServiceService', () => {
  let service: PostAudioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostAudioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
