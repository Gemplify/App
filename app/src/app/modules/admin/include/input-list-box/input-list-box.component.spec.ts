import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputListBoxComponent } from './input-list-box.component';

describe('InputListBoxComponent', () => {
  let component: InputListBoxComponent;
  let fixture: ComponentFixture<InputListBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputListBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
