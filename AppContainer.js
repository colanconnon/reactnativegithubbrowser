'use strict';

var React = require('react-native');

var {
    Text,
    View,
    Component,
    StyleSheet,
    TabBarIOS,
    NavigatorIOS,
} = React;

var Feed = require('./Feed');

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'feed',
    };
  }

  render() {
    return (
      <TabBarIOS style={styles.container}>
        <TabBarIOS.Item
          title="Feed"
          selected={this.state.selectedTab == 'feed'}
          onPress={() => this.setState({selectedTab: 'feed' })}
          >
          <NavigatorIOS
                 style={{
                   flex: 1,
                 }}
                 initialRoute={{
                   component: Feed,
                   title: 'Feed',
                 }}
               />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Feed"
          selected={this.state.selectedTab == 'search'}
          onPress={() => this.setState({selectedTab: 'search' })}
          >
          <Text style={styles.welcome}>Tab 2</Text>
        </TabBarIOS.Item>
      </TabBarIOS>

    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 100,
  },
});
module.exports = AppContainer;
