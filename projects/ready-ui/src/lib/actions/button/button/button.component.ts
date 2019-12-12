/* tslint:disable:component-selector */
import { Input, Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'button[ui-button], a[ui-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input()
  variant: 'stroked' | 'flat' | 'basic' | 'inline' = 'basic';

  @Input()
  color: 'primary' | 'danger' | 'warning' | 'default' | 'white' = 'default';

  @HostBinding('class.stroked')
  get stroked() {
    return this.variant === 'stroked';
  }

  @HostBinding('class.flat')
  get flat() {
    return this.variant === 'flat';
  }

  @HostBinding('class.basic')
  get basic() {
    return this.variant === 'basic';
  }

  @HostBinding('class.inline')
  get inline() {
    return this.variant === 'inline';
  }

  @HostBinding('class.primary')
  get primary() {
    return this.color === 'primary';
  }

  @HostBinding('class.white')
  get white() {
    return this.color === 'white';
  }

  @HostBinding('class.danger')
  get danger() {
    return this.color === 'danger';
  }

  @HostBinding('class.warning')
  get warning() {
    return this.color === 'warning';
  }

  @HostBinding('class.default')
  get default() {
    return this.color === 'default';
  }

  constructor() {}
}
