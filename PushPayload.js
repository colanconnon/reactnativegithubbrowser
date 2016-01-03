'use strict';

var React = require('react-native');

var {
    Text,
    View,
    Component,
    ListView,
    Image,
} = React;

var moment = require('moment');

class PushPayload extends Component {
  constructor(props) {
    super(props);
    console.log(this.state);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    });
    this.state = {
      dataSource: ds,
      pushEvent: props.pushEvent,
    };
  }

 componentDidMount() {
   //
 }

 renderRow(rowData) {
   return (
     <View style={{
         flex: 1,
         justifyContent: 'center',
       }}>
        <Text>{rowData.sha.substring(0, 6)} - {rowData.message}</Text>
     </View>
   );
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
        paddingTop: 80,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
        <Image
          source={{uri: this.state.pushEvent.actor.avatar_url}}
          style={{
            height: 120,
            width: 120,
            borderRadius: 60,
          }}
          />
        <Text style={{
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 20,
          }}>
          {moment(this.state.pushEvent.created_at).fromNow()}
        </Text>
        <Text>{this.state.pushEvent.actor.login}</Text>
        <Text>{this.state.pushEvent.payload.description}</Text>
        <Text>at {this.state.pushEvent.repo.name}</Text>
        <Text>
          {this.state.pushEvent.payload.commits.length}
        </Text>
        <ListView
          datasource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          />

      </View>
    );

  }

}
module.exports = PushPayload;
