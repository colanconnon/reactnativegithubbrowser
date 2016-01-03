'use strict';

var React = require('react-native');

var {
    Text,
    View,
    Component,
    ListView,
    Image,
    ActivityIndicatorIOS,
    TouchableHighlight,
} = React;

var moment = require('moment');
var PushPayload = require('./PushPayload');

class Feed extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    });
    this.state = {
      dataSource: ds,
      showProgress: true,
    };
  }

 componentDidMount() {
    this.fetchFeed();
  }

  fetchFeed() {
    require('./AuthService').getAuthInfo((err, authInfo)=> {
      var url = 'https://api.github.com/users/' + authInfo.user.login
      + '/received_events';
      console.log(url);
      fetch(url, {
        headers: authInfo.header,
      })
      .then((response) => response.json())
      .then((responseData) => {
        //.filter((ev) =>
        //    ev.type == 'PushEvent');
        var feedItems =
          responseData.filter((ev) =>
            ev.type == 'PushEvent');
        console.log(feedItems);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(feedItems),
          showProgress: false,
        });
      });
    });
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={() => this.pressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center',
          borderColor: '#D7D7D7',
          borderBottomWidth: 1,
        }}>
          <Image
              source={{uri: rowData.actor.avatar_url}}
              style={{
                height: 36,
                width: 36,
                borderRadius: 18,
              }}
          />
          <View style={{
              paddingLeft: 20,
              flex: 1,
            }}>
            <Text style={{backgroundColor: '#fff'}}>
              {moment(rowData.created_at).fromNow()}
            </Text>
            <Text style={{backgroundColor: '#fff'}}>
              {rowData.actor.login}
            </Text>
            <Text style={{backgroundColor: '#fff'}}>
              {rowData.payload.description}
            </Text>
            <Text style={{backgroundColor: '#fff'}}>
              at <Text style={{
                fontWeight: '600',
              }}>
              {rowData.repo.name}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  pressRow(rowData) {
    console.log(rowData);
    this.props.navigator.push({
      title: 'Push Event',
      component: PushPayload,
      passProps: {
        pushEvent: rowData,
      },
    });
  }

  render() {
    if (this.state.showProgress) {
      return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
          }}
          >
          <ActivityIndicatorIOS
            size="large"
            animating={true} />
        </View>
      );
    }

    return (
      <View style={{
        flex: 1,
        marginTop: 60,
        justifyContent: 'flex-start',
      }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );

  }

}
module.exports = Feed;
