import { Component, OnInit } from '@angular/core';

declare var window: any;

@Component({
  selector: 'cp-trackers',
  templateUrl: './cp-trackers.component.html',
})
export class CPTrackersComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    (function (h, o, t, j) {
      h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: 514110, hjsv: 5 };
      let a = o.getElementsByTagName('head')[0];
      let r: any = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
  }
}