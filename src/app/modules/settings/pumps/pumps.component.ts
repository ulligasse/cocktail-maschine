import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Ingredient } from '../../../shared/models/ingredient.model';
import { Pump } from '../../../shared/models/pump.model';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DialogPumpsComponent } from './dialog-pumps/dialog-pumps.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-pumps',
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
  templateUrl: './pumps.component.html',
})
export class PumpsComponent {
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
          value: ingredient.data().value,
          sparkling: ingredient.data().sparkling,
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
      if (result && parseFloat(result.ml_per_second)) {
        if (result.id.length > 0) {
          let id = result.id || new String();
          delete result.id;
          this.pumpCollection
            .doc(id.toString())
            .set(result)
            .then((v) => location.reload());
        }
      } else location.reload();
    });
  }
}
