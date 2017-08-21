import { URLSearchParams } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { StudentsService } from './../students.service';
import { CPSession } from './../../../../../session/index';
import { FORMAT } from './../../../../../shared/pipes/date.pipe';
import { BaseComponent } from './../../../../../base/base.component';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';

interface IState {
  search_str: string,
  list_id: number
}

declare var $;

@Component({
  selector: 'cp-engagement-students-list',
  templateUrl: './engagement-students-list.component.html',
  styleUrls: ['./engagement-students-list.component.scss']
})
export class EngagementStudentsListComponent extends BaseComponent implements OnInit {
  loading;
  students = [];

  state: IState = {
    search_str: null,
    list_id: null,
  }
  messageData;
  dateFormat = FORMAT.DATETIME;
  isStudentComposeModal = false;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private service: StudentsService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  fetch() {
    const search = new URLSearchParams();
    const list_id = this.state.list_id ? this.state.list_id.toString() : null;

    search.append('school_id', this.session.school.id.toString());
    search.append('search_str', this.state.search_str);
    search.append('list_id', list_id);

    const stream$ = this.service.getStudentsByList(search, this.startRange, this.endRange);
    super
      .fetchData(stream$)
      .then(res => this.students = res.data)
      .catch(err => console.log(err));

  }

  onPaginationNext(): void {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious(): void {
    super.goToPrevious();
    this.fetch();
  }

  onFlashMessage() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: 'Success! Your message has been sent',
        autoClose: true,
      }
    });
  }

  onComposeTeardown() {
    this.messageData = null;
    this.isStudentComposeModal = false;
  }

  messageStudent(student) {
    this.messageData = {
      name: `${student.first_name} ${student.last_name}`,
      userIds: [student.id]
    };

    this.isStudentComposeModal = true;
    setTimeout(() => { $('#studentsComposeModal').modal(); }, 1);
  }

  onFilter(filterBy) {
    this.state = Object.assign(
      {},
      this.state,
      {
        search_str: filterBy.search_str,
        list_id: filterBy.list_id,
      }
    )
    this.fetch();
  }

  ngOnInit() {
    this.fetch();
  }
}
