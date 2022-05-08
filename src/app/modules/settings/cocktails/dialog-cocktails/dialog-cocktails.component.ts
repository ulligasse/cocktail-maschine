import { Component, Inject, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
} from '@angular/fire/compat/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Cocktail } from 'src/app/shared/models/cocktail.model';
import { Ingredient } from 'src/app/shared/models/ingredient.model';

@Component({
  selector: 'app-dialog-cocktails',
  templateUrl: './dialog-cocktails.component.html',
  styleUrls: ['./dialog-cocktails.component.scss'],
})
export class DialogCocktailsComponent implements OnInit {
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;
  ingredients: Ingredient[] = [];
  selected_ingredient: Ingredient = new Ingredient();

  constructor(
    public dialogRef: MatDialogRef<DialogCocktailsComponent>,
    @Inject(MAT_DIALOG_DATA) public cocktail: Cocktail,
    afs: AngularFirestore
  ) {
    this.ingredientCollection = afs.collection<Ingredient>('ingredients');
    this.ingredientCollection.get().subscribe((ingredients) => {
      ingredients.docs.forEach((ingredient) => {
        this.ingredients.push({
          id: ingredient.id,
          name: ingredient.data().name,
        });
      });
    });
  }

  formatLabel(value: number) {
    return value + 'ml';
  }

  addIngredient() {
    this.cocktail.ingredients.push({ id: this.selected_ingredient.id });
    this.selected_ingredient = new Ingredient();
  }

  getIngredientName(id: String): String {
    return this.ingredients.find((v) => v.id == id)?.name || new String();
  }

  ngOnInit(): void {}
}
