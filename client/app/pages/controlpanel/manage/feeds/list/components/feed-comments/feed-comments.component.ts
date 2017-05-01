import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';
import { BaseComponent } from '../../../../../../../base/base.component';

interface IState {
  comments: Array<any>;
}

const state: IState = {
  comments: []
};

@Component({
  selector: 'cp-feed-comments',
  templateUrl: './feed-comments.component.html',
  styleUrls: ['./feed-comments.component.scss']
})
export class FeedCommentsComponent extends BaseComponent implements OnInit {
  @Input() feedId: number;
  @Input() isCampusWallView: Observable<number>;

  loading;
  comments;
  groupId: number;
  _isCampusWallView;
  state: IState = state;

  constructor(
    private feedsService: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onDeletedComment(commentId: number) {
    let _state = Object.assign({}, this.state);

    _state.comments = _state.comments.filter(comment => comment.id !== commentId);

    this.state = Object.assign({}, this.state, { comments: _state.comments });
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('thread_id', this.feedId.toString());

    if (this._isCampusWallView) {
      search.append('school_id', '157');
    } else {
      search.append('group_id', this.groupId.toString());
    }

    let campusWallComments$ = this.feedsService.getCampusWallCommentsByThreadId(search);
    let groupWallComments$ = this.feedsService.getGroupWallCommentsByThreadId(search);
    let stream$ = this._isCampusWallView ? campusWallComments$ : groupWallComments$;

    super
      .fetchData(stream$)
      .then(res => {
        let _comments = [];

        res.data.map(comment => {
          _comments.push({
            id: comment.id,
            avatar_thumb: comment.avatar_thumb,
            image_thumb_url: comment.image_thumb_url,
            message: comment.comment,
            likes: comment.likes,
            flag: comment.flag,
            dislikes: comment.dislikes,
            display_name: comment.display_name,
            added_time: comment.added_time
          });
        });
        this.state = Object.assign({}, this.state, { comments: _comments });
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.isCampusWallView.subscribe(res => {
      this.groupId = res;
      this._isCampusWallView = res === 1 ? true : false;
    });
    this.fetch();
  }
}