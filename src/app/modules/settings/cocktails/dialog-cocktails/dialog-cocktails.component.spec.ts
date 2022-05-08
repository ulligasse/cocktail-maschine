import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCocktailsComponent } from './dialog-cocktails.component';

describe('DialogCocktailsComponent', () => {
  let component: DialogCocktailsComponent;
  let fixture: ComponentFixture<DialogCocktailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCocktailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCocktailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
