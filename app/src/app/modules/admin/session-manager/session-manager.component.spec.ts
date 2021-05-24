import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockManagerComponent } from './session-manager.component';

describe('BlockManagerComponent', () => {
  let component: BlockManagerComponent;
  let fixture: ComponentFixture<BlockManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
