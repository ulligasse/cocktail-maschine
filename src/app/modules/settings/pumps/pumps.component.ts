import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  pumps: Pump[] = [];
  ingredients: Ingredient[] = [];
  isAdmin: Boolean = false;

  constructor(
    public dialog: MatDialog,
    afs: AngularFirestore,
    private auth: AngularFireAuth
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

    this.pumpCollection = afs.collection<Pump>('pumps');
    this.pumpCollection.get().subscribe((pumps) => {
      pumps.docs.forEach((pump) => {
        this.pumps.push({
          id: pump.id,
          ingredient: pump.data().ingredient,
          ml_per_second: pump.data().ml_per_second,
        });
      });
    });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user?.email?.includes('admin')) this.isAdmin = true;
    });
  }

  openPumpsDialog(pump?: Pump) {
    const dialogRef = this.dialog.open(DialogPumpsComponent, {
      width: '95%',
      data: pump || new Pump(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.id.length > 0) {
        let id = result.id || new String();
        delete result.id;
        this.pumpCollection
          .doc(id.toString())
          .set(result)
          .then((v) => location.reload());
      }
    });
  }
}
