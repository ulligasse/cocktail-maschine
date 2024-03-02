import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { Cocktail } from '../../../shared/models/cocktail.model';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatSliderModule,
    MatButton,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent {
  totalMl: number = 0;
  procentualIngredients: Number[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public cocktail: Cocktail
  ) {
    this.cocktail.ingredients.forEach((i) => {
      this.totalMl += i.value;
    });

    this.cocktail.ingredients.forEach((i) => {
      this.procentualIngredients.push(i.value / this.totalMl);
    });
  }

  ngOnInit(): void {}

  formatLabel(value: number) {
    return value + 'ml';
  }

  closeDialog(order: boolean) {
    this.procentualIngredients.forEach((v, i) => {
      this.cocktail.ingredients[i].value = (
        parseFloat(v.toFixed(2)) * this.totalMl
      ).toFixed(0);
    });

    this.dialogRef.close({ order: order, cocktail: this.cocktail });
  }
}
