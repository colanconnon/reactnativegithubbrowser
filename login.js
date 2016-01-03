'use strict';

var React = require('react-native');
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var View = React.View;
var TextInput = React.TextInput;
var TouchableHighlight = React.TouchableHighlight;
var Component = React.Component;
var ActivityIndicatorIOS = React.ActivityIndicatorIOS;
var buffer = require('buffer');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProgress: false,
    };
  }

  render() {
    var errorCtrl = <View />;

    if (!this.state.success && this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
        That username and password combination did not work
      </Text>;
    }

    if (!this.state.success && this.state.unknownError) {
      errorCtrl = <Text style={styles.error}>
        unknownError please try again
      </Text>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Login screen
        </Text>
        <TextInput
          onChangeText={(text) => this.setState({username: text}) }
           style= {styles.input}
          placeholder="Github username" />
        <TextInput style= {styles.input}
          onChangeText={(text) => this.setState({password: text}) }
          placeholder="Github Password"
          secureTextEntry={true}
           />
         <TouchableHighlight
           onPress={this.onLoginPressed.bind(this)}
           style={styles.button}>
           <Text style={styles.buttonText}>Log in</Text>
         </TouchableHighlight>
         <ActivityIndicatorIOS
           animating={this.state.showProgress}
           size="large"
           style={styles.loader}
           />
         {errorCtrl}
      </View>
    );
  }

  onLoginPressed() {
    console.log(this.state.username);
    this.setState({showProgress: true});
    var authService = require('./AuthService');
    authService.login({
      username: this.state.username,
      password: this.state.password,
    }, (results) => {
      this.setState(Object.assign({showProgress: false}, results));
      if (results.success && this.props.onLogin) {
        this.props.onLogin();
      }

    });
  }

}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    flex: 1,
    paddingTop: 40,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    width: 156,
    height: 55,
    color: '#fff',
    fontSize: 22,
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#333',
    alignSelf: 'center',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',

  },
});

module.exports = Login;
