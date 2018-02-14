import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import 'node_modules/quill/dist/quill.core.css';
import 'node_modules/quill/dist/quill.snow.css';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CPI18nService } from '../../services';
import { QuillService } from './../../services/quill.service';

interface IState {
  body: string;
}

const state: IState = {
  body: null,
};

@Component({
  selector: 'cp-text-editor',
  templateUrl: './cp-text-editor.component.html',
  styleUrls: ['./cp-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CPTextEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() image$: Subject<string>;
  @Input() reset$: Subject<boolean>;
  @Output() contentChange: EventEmitter<IState> = new EventEmitter();
  @ViewChild('editor') editor: ElementRef;

  quillInstance;
  subscriptions = [];
  state: IState = state;

  constructor(private cpI18n: CPI18nService) {}

  ngAfterViewInit() {
    this.launch();
  }

  launch() {
    const el = this.editor.nativeElement;

    const options = {
      modules: {
        toolbar: null,
      },
      placeholder: this.cpI18n.translate('feeds_input_placeholder'),
      theme: 'snow',
    };

    this.quillInstance = new QuillService(el, options);
    this.quillInstance.on('text-change', this.textChangeHandler.bind(this));
  }

  textChangeHandler() {
    this.state = Object.assign({}, this.state, {
      body: this.quillInstance.getText(),
    });
    this.contentChange.emit(this.state);
  }

  reset() {
    this.quillInstance.reset();
  }

  ngOnInit() {
    this.subscriptions.push(this.image$);
    this.subscriptions.push(this.reset$);

    if (!this.image$) {
      return Observable.of(null);
    }

    this.reset$.subscribe((reset) => {
      if (reset) {
        this.reset();
      }
    });

    this.image$.subscribe((image: string) => {
      if (image) {
        this.quillInstance.insertImage(image);
      }
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
