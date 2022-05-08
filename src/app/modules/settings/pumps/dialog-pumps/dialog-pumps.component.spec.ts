import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPumpsComponent } from './dialog-pumps.component';

describe('DialogPumpsComponent', () => {
  let component: DialogPumpsComponent;
  let fixture: ComponentFixture<DialogPumpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPumpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
