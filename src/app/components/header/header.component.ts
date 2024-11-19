import { Component, computed, input, model, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import { MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  collapsed = model(false)

  collapse(){
    this.collapsed.set(!this.collapsed())
    console.log(this.collapsed())
  }
}
