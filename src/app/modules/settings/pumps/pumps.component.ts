import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { Pump } from 'src/app/shared/models/pump.model';
import { DialogPumpsComponent } from './dialog-pumps/dialog-pumps.component';

@Component({
  selector: 'app-pumps',
  templateUrl: './pumps.component.html',
  styleUrls: ['./pumps.component.scss'],
})
export class PumpsComponent implements OnInit {
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;
  private pumpCollection: AngularFirestoreCollection<Pump>;
  pumps: Observable<Pump[]> = new Observable<Pump[]>();
  ingredients: Ingredient[] = [];

  constructor(public dialog: MatDialog, afs: AngularFirestore) {
    this.ingredientCollection = afs.collection<Ingredient>('ingredients');
    this.ingredientCollection.get().subscribe((ingredients) => {
      ingredients.docs.forEach((ingredient) => {
        this.ingredients.push({
          id: ingredient.id,
          name: ingredient.data().name,
        });
      });
    });

    this.pumpCollection = afs.collection<Pump>('pumps');
    this.pumps = this.pumpCollection.snapshotChanges().pipe(
      map((pumps) =>
        pumps.map((pump) => {
          let data = pump.payload.doc.data();
          data.id = pump.payload.doc.id;
          return data;
        })
      )
    );
  }

  ngOnInit(): void {}

  openPumpsDialog(pump?: Pump) {
    const dialogRef = this.dialog.open(DialogPumpsComponent, {
      width: '95%',
      data: pump || new Pump(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.id.length > 0) {
        let id = result.id || new String();
        delete result.id;
        this.pumpCollection.doc(id.toString()).set(result);
      }
    });
  }
}
