import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../feeds.service';
import { CPSession } from '../../../../../../session';
import { BaseComponent } from '../../../../../../base/base.component';

interface IState {
  group_id: number;
  wall_type: number;
  feeds: Array<any>;
  isCampusThread: boolean;
  postingMemberType: number;
  commentingMemberType: boolean;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  feeds: [],
  group_id: null,
  wall_type: null,
  isCampusThread: true,
  postingMemberType: null,
  commentingMemberType: true,
  flagged_by_users_only: null,
  removed_by_moderators_only: null
};

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent extends BaseComponent implements OnInit {
  @Input() clubId: number;
  @Input() isClubsView: boolean;

  feeds;
  groups;
  isSimple;
  channels;
  loading = true;
  state: IState = state;
  isFilteredByRemovedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFilteredByFlaggedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null

  });

  constructor(
    public session: CPSession,
    public service: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onDoFilter(data) {
    this.isCampusWallView$.next({
      type: data.wall_type,
      group_id: data.group_id
    });

    // filter by removed posts
    if (data.removed_by_moderators_only) {
      this.isFilteredByRemovedPosts$.next(true);
    } else {
      this.isFilteredByRemovedPosts$.next(false);
    }

    // filter by flagged posts
    if (data.flagged_by_users_only) {
      this.isFilteredByFlaggedPosts$.next(true);
    } else {
      this.isFilteredByFlaggedPosts$.next(false);
    }

    this.state = Object.assign(
      {},
      this.state,
      {
        group_id: data.group_id,
        wall_type: data.wall_type,
        commentingMemberType: data.commentingMemberType,
        postingMemberType: data.postingMemberType,
        isCampusThread: data.wall_type === 1 ? true : false,
        flagged_by_users_only: data.flagged_by_users_only,
        removed_by_moderators_only: data.removed_by_moderators_only
      }
    );

    this.fetch();
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

    let flagged = this.state.flagged_by_users_only ?
      this.state.flagged_by_users_only.toString() : null;

    let removed = this.state.removed_by_moderators_only ?
      this.state.removed_by_moderators_only.toString() : null;

    let type = this.state.postingMemberType ?
      this.state.postingMemberType.toString() : null;

    search.append('postingMemberType', type);
    search.append('flagged_by_users_only', flagged);
    search.append('removed_by_moderators_only', removed);

    if (this.state.isCampusThread) {
      search.append('school_id', this.session.g.get('school').id.toString());
    } else {
      search.append('group_id', this.state.wall_type.toString());
    }

    let stream$ = this.doAdvancedSearch(search);

    super
      .fetchData(stream$)
      .then(res => {
        this.state = Object.assign({}, this.state, { feeds: res.data });
      })
      .catch(_ => null);
  }

  doAdvancedSearch(search) {
    let stream$;

    let groupThread$ = this.service.getGroupWallFeeds(this.startRange, this.endRange, search);
    let campusThread$ = this.service.getCampusWallFeeds(this.startRange, this.endRange, search);

    if (this.state.isCampusThread) {
      let _search = new URLSearchParams();
      _search.append('school_id', this.session.g.get('school').id.toString());

      let channels$ = this.service.getChannelsBySchoolId(1, 1000, _search);

      stream$ =
        Observable
          .combineLatest(campusThread$, channels$)
          .map(res => {
            let result = [];
            let threads = res[0];
            this.channels = res[1];


            threads.forEach(thread => {
              result.push({
                ...thread,
                channelName: this.getChannelNameFromArray(this.channels, thread)
              });
            });
            return result;
          });
    } else {
      return groupThread$;
    }

    return stream$;
  }

  getChannelNameFromArray(channels, thread) {
    let name;
    channels.filter(channel => {
      if (channel.id === thread.post_type) {
        name = channel.name;
      }
    });
    return name;
  }

  onCreated(feed) {
    // do not append to list if currently filtering by flagged or removed posts
    if (this.isFilteredByRemovedPosts$.value || this.isFilteredByFlaggedPosts$.value) { return; }

    let channelName;

    if (this.state.isCampusThread) {
      channelName = this.getChannelNameFromArray(this.channels, feed);
    }

    feed = Object.assign({}, feed, {
      ...feed,
      channelName
    });


    this.state = Object.assign(
      {},
      this.state,
      { feeds: [feed, ...this.state.feeds] }
    );
  }

  onEdited(feed) {
    let _state = Object.assign({}, this.state, {
      feeds: this.state.feeds.map(_feed => {
        if (_feed.id === feed.id) {
          return _feed = feed;
        }
        return _feed;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeleted(feedId: number) {
    let _state = Object.assign({}, this.state);

    _state.feeds = _state.feeds.filter(feed => feed.id !== feedId);

    this.state = Object.assign({}, this.state, { feeds: _state.feeds });
  }

  ngOnInit() {
    this.isSimple = this.isClubsView;
  }
}
