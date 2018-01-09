import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../../../../../../../base/base.component';
import { CPSession } from '../../../../../../../session';
import { FeedsService } from '../../../feeds.service';

interface IState {
  comments: Array<any>;
}

const state: IState = {
  comments: [],
};

@Component({
  selector: 'cp-feed-comments',
  templateUrl: './feed-comments.component.html',
  styleUrls: ['./feed-comments.component.scss'],
})
export class FeedCommentsComponent extends BaseComponent implements OnInit {
  @Input() feedId: number;
  @Input() isCampusWallView: Observable<number>;
  @Output() deleted: EventEmitter<null> = new EventEmitter();

  loading;
  comments;
  groupId: number;
  _isCampusWallView;
  state: IState = state;

  constructor(private session: CPSession, private feedsService: FeedsService) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onDeletedComment(commentId: number) {
    const _state = Object.assign({}, this.state);

    _state.comments = _state.comments.filter(
      (comment) => comment.id !== commentId,
    );

    this.state = Object.assign({}, this.state, { comments: _state.comments });
    this.deleted.emit();
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('thread_id', this.feedId.toString());

    if (this._isCampusWallView) {
      search.append('school_id', this.session.g.get('school').id.toString());
    } else {
      search.append('group_id', this.groupId.toString());
    }

    const campusWallComments$ = this.feedsService.getCampusWallCommentsByThreadId(
      search,
    );
    const groupWallComments$ = this.feedsService.getGroupWallCommentsByThreadId(
      search,
    );
    const stream$ = this._isCampusWallView
      ? campusWallComments$
      : groupWallComments$;

    super
      .fetchData(stream$)
      .then((res) => {
        const _comments = [];

        res.data.map((comment) => {
          _comments.push({
            id: comment.id,
            avatar_thumb: comment.avatar_thumb,
            image_thumb_url: comment.image_thumb_url,
            message: comment.comment,
            likes: comment.likes,
            flag: comment.flag,
            dislikes: comment.dislikes,
            display_name: comment.display_name,
            added_time: comment.added_time,
          });
        });
        this.state = Object.assign({}, this.state, { comments: _comments });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  ngOnInit() {
    this.isCampusWallView.subscribe((res: any) => {
      this.groupId = res.type;
      this._isCampusWallView = res.type === 1;
    });
    this.fetch();
  }
}