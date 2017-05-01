import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { ClubsService } from '../clubs.service';
import { BaseComponent } from '../../../../../base/base.component';

interface IState {
  clubs: Array<any>;
  query: string;
  type: string;
}

const state: IState = {
  clubs: [],
  query: null,
  type: null
};

@Component({
  selector: 'cp-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss']
})
export class ClubsListComponent extends BaseComponent implements OnInit {
  loading;
  deleteClub = '';
  state: IState = state;

  constructor(
    private clubsService: ClubsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('type', state.type);
    search.append('query', state.query);

    super
      .fetchData(this.clubsService.getClubs(search))
      .then(res => {
        this.state = Object.assign({}, this.state, { clubs: res.data });
      })
      .catch(err => console.log(err));
  }

  doFilter(filter) {
    this.state = Object.assign({}, this.state, {
      query: filter.query,
      type: filter.type
    });

    this.fetch();
  }

  onDeletedClub(clubId) {
    this.state = Object.assign(
      {},
      this.state,
      { clubs: this.state.clubs.filter(club => club.id !== clubId) }
    );
  }

  onPaginationNext() {

  }

  onPaginationPrevious() {

  }

  ngOnInit() { }
}