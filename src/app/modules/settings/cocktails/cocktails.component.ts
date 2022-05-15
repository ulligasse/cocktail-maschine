import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Cocktail } from 'src/app/shared/models/cocktail.model';
import { DialogCocktailsComponent } from './dialog-cocktails/dialog-cocktails.component';

@Component({
  selector: 'app-cocktails',
  templateUrl: './cocktails.component.html',
  styleUrls: ['./cocktails.component.scss'],
})
export class CocktailsComponent implements OnInit {
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

  openCocktailDialog(cocktail?: Cocktail) {
    const dialogRef = this.dialog.open(DialogCocktailsComponent, {
      width: '95%',
      data: cocktail || new Cocktail(),
    });

    dialogRef.afterClosed().subscribe((result) => {
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
    });
  }

  deleteCocktail(cocktail: Cocktail) {
    this.cocktailCollection
      .doc(cocktail.id?.toString())
      .delete()
      .then((v) => location.reload());
  }
}
