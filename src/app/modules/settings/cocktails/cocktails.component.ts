import { Component, OnInit } from '@angular/core';
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
  cocktails: Observable<Cocktail[]> = new Observable<Cocktail[]>();

  constructor(public dialog: MatDialog, afs: AngularFirestore) {
    this.cocktailCollection = afs.collection<Cocktail>('cocktails');
    this.cocktails = this.cocktailCollection.snapshotChanges().pipe(
      map((cocktails) =>
        cocktails.map((cocktail) => {
          let data = cocktail.payload.doc.data();
          data.id = cocktail.payload.doc.id;
          return data;
        })
      )
    );
  }

  ngOnInit(): void {}

  openCocktailDialog(cocktail?: Cocktail) {
    const dialogRef = this.dialog.open(DialogCocktailsComponent, {
      width: '95%',
      data: cocktail || new Cocktail(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.id?.length > 0) {
        let id = result.id || new String();
        delete result.id;
        this.cocktailCollection.doc(id.toString()).set(result);
      } else this.cocktailCollection.add(JSON.parse(JSON.stringify(result)));
    });
  }

  deleteCocktail(cocktail: Cocktail) {
    this.cocktailCollection.doc(cocktail.id?.toString()).delete();
  }
}
