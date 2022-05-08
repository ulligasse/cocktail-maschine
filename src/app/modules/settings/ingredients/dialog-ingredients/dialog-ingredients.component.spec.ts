import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogIngredientsComponent } from './dialog-ingredients.component';

describe('DialogIngredientsComponent', () => {
  let component: DialogIngredientsComponent;
  let fixture: ComponentFixture<DialogIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIngredientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
