import { Component, Inject, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { Pump } from 'src/app/shared/models/pump.model';

@Component({
  selector: 'app-dialog-pumps',
  templateUrl: './dialog-pumps.component.html',
  styleUrls: ['./dialog-pumps.component.scss'],
})
export class DialogPumpsComponent implements OnInit {
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

  ngOnInit(): void {}
}
