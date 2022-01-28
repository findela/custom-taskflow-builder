import { TestBed } from '@angular/core/testing';

import { TaskflowBuilderService } from './taskflow-builder.service';

describe('TaskflowBuilderService', () => {
  let service: TaskflowBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskflowBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
