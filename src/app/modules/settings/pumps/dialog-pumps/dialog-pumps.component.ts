import { Component, Inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Ingredient } from '../../../../shared/models/ingredient.model';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Pump } from '../../../../shared/models/pump.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-pumps',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatInput,
    MatDialogActions,
    MatDialogClose,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dialog-pumps.component.html',
})
export class DialogPumpsComponent {
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;
  ingredients: Ingredient[] = [];
  selected_ingredient: Ingredient = new Ingredient();

  constructor(
    public dialogRef: MatDialogRef<DialogPumpsComponent>,
    @Inject(MAT_DIALOG_DATA) public pump: Pump,
    afs: AngularFirestore
  ) {
    this.ingredientCollection = afs.collection<Ingredient>('ingredients');
    this.ingredientCollection.get().subscribe((ingredients) => {
      ingredients.docs
        .sort((a, b) => (a.data().name < b.data().name ? -1 : 1))
        .forEach((ingredient) => {
          this.ingredients.push({
            id: ingredient.id,
            name: ingredient.data().name,
            value: ingredient.data().value,
            sparkling: ingredient.data().sparkling,
          });
        });
    });
  }
}
