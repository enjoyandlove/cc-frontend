import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonComponent } from './button/button.component';

@NgModule({
  exports: [ButtonComponent],
  declarations: [ButtonComponent],
  imports: [CommonModule]
})
export class ButtonModule {}
