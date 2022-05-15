import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cocktail } from 'src/app/shared/models/cocktail.model';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})
export class DialogConfirmComponent implements OnInit {
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
