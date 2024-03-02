import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Ingredient } from '../../../../shared/models/ingredient.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-dialog-ingredients',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatButton,
    MatInput,
    MatLabel,
    MatCheckbox,
    FormsModule,
  ],
  templateUrl: './dialog-ingredients.component.html',
})
export class DialogIngredientsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogIngredientsComponent>,
    @Inject(MAT_DIALOG_DATA) public ingredient: Ingredient
  ) {}
}
