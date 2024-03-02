import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Cocktail } from '../../../shared/models/cocktail.model';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DialogCocktailsComponent } from './dialog-cocktails/dialog-cocktails.component';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-cocktails',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatCard,
    MatList,
    MatListItem,
    MatDivider,
    MatIconButton,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './cocktails.component.html',
})
export class CocktailsComponent {
  private cocktailCollection: AngularFirestoreCollection<Cocktail>;
  cocktails: Cocktail[] = [];
  isAdmin: Boolean = false;

  constructor(
    public dialog: MatDialog,
    afs: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.cocktailCollection = afs.collection<Cocktail>('cocktails');
    this.cocktailCollection.get().subscribe((cocktails) => {
      cocktails.docs
        .sort((a, b) => (a.data().name < b.data().name ? -1 : 1))
        .forEach((cocktail) => {
          this.cocktails.push({
            id: cocktail.id,
            name: cocktail.data().name,
            ingredients: cocktail.data().ingredients,
          });
        });
    });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user?.email?.includes('admin')) this.isAdmin = true;
    });
  }

  isIngredientsNumeric(cocktail: Cocktail) {
    let numeric = true;

    cocktail.ingredients.forEach((ingredient) => {
      if (!parseFloat(ingredient.value)) numeric = false;
    });

    return numeric;
  }

  openCocktailDialog(cocktail?: Cocktail) {
    const dialogRef = this.dialog.open(DialogCocktailsComponent, {
      width: '95%',
      data: cocktail || new Cocktail(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.isIngredientsNumeric(result)) {
        if (result.id?.length > 0) {
          let id = result.id || new String();
          delete result.id;
          this.cocktailCollection
            .doc(id.toString())
            .set(result)
            .then((v) => location.reload());
        } else
          this.cocktailCollection
            .add(JSON.parse(JSON.stringify(result)))
            .then((v) => location.reload());
      } else {
        location.reload();
      }
    });
  }

  deleteCocktail(cocktail: Cocktail) {
    this.cocktailCollection
      .doc(cocktail.id?.toString())
      .delete()
      .then((v) => location.reload());
  }
}
