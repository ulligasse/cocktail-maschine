import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ingredient } from 'src/app/shared/models/ingredient.model';

@Component({
  selector: 'app-dialog-ingredients',
  templateUrl: './dialog-ingredients.component.html',
  styleUrls: ['./dialog-ingredients.component.scss'],
})
export class DialogIngredientsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogIngredientsComponent>,
    @Inject(MAT_DIALOG_DATA) public ingredient: Ingredient
  ) {}

  ngOnInit(): void {}
}
