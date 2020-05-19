// 메인스크린
// 데이터베이스에서 목록을 가져와 출력

import firebase from "firebase";
import React, { Component } from "react";
import { LayoutAnimation, RefreshControl } from "react-native";

import List from "../components/List";
import Fire from "../Fire";

// 화면에 로드할 글의 수
const PAGE_SIZE = 5;
console.disableYellowBox = true;
export default class FeedScreen extends Component {
  state = {
    loading: false,
    posts: [],
    data: {}
  };

  componentDidMount() {
    // 페이지 로드 되면
    if (Fire.shared.uid) {
      // 5개의 글 로드
      this.makeRemoteRequest();
    } else {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.makeRemoteRequest();
        }
      });
    }
  }

  addPosts = posts => {
    this.setState(previousState => {
      let data = {
        ...previousState.data,
        ...posts
      };
      return {
        data,
        // 시간별 정렬
        posts: Object.values(data).sort((a, b) => a.timestamp < b.timestamp)
      };
    });
  };

  makeRemoteRequest = async lastKey => {
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true });

    const { data, cursor } = await Fire.shared.getPaged({
      size: PAGE_SIZE,
      start: lastKey
    });

    this.lastKnownKey = cursor;
    let posts = {};
    for (let child of data) {
      posts[child.key] = child;
    }
    this.addPosts(posts);

    this.setState({ loading: false });
  };

  _onRefresh = () => this.makeRemoteRequest();

  onPressFooter = () => this.makeRemoteRequest(this.lastKnownKey);

  render() {
    LayoutAnimation.easeInEaseOut();
    return (
      <List
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this._onRefresh}
          />
        }
        onPressFooter={this.onPressFooter}
        data={this.state.posts}
      />
    );
  }
}
