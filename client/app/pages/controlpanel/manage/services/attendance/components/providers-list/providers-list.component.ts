import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { generateExcelFile } from './excel';
import { ProvidersService } from '../../../providers.service';
import { BaseComponent } from '../../../../../../../base/base.component';

interface IState {
  search_text: string;
  providers: Array<any>;
}

const state: IState = {
  providers: [],
  search_text: null
};

@Component({
  selector: 'cp-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ServicesProvidersListComponent extends BaseComponent implements OnInit {
  @Input() serviceId: number;
  @Input() query: Observable<string>;
  @Input() reload: Observable<boolean>;
  @Input() download: Observable<boolean>;

  loading;
  deleteProvider = '';
  state: IState = state;

  constructor(
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('search_text', this.state.search_text );
    search.append('service_id', this.serviceId.toString());

    super
      .fetchData(this.providersService.getProviders(this.startRange, this.endRange, search))
      .then(res => this.state = Object.assign({}, this.state, { providers: res.data }))
      .catch(err => console.log(err));
  }

  onDeleted(providerId) {
    this.state = Object.assign(
      {},
      this.state,
      { providers: this.state.providers.filter(provider => provider.id !== providerId) }
    );
  }

  ngOnInit() {
    this.query.subscribe(search_text => {
      this.state = Object.assign({}, this.state, { search_text });
      this.fetch();
    });

    this.reload.subscribe(reload => {
      if (reload) {
        this.fetch();
      }
    });

    this.download.subscribe(download => {
      if (download) {
        generateExcelFile(this.state.providers);
      }
    });

    this.fetch();
  }
}