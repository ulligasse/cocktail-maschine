import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatToolbar,
    MatIcon,
    MatList,
    MatListItem,
    MatDivider,
    MatIconButton,
    RouterModule,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {}
