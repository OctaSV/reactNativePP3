import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { auth, db } from '../firebase/Config'
import Post from '../components/Post';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      userPosts: [],
      loader: true,
    }
  }

  getUserData() {
    let user = ''
    if(this.props.route.params?.user) {
      user = this.props.route.params.user;
    } else {
      user = auth.currentUser.email;
    }
    db.collection("users").where("email", '==', user).onSnapshot((docs) => {
      let userInfo = [];
      docs.forEach((doc) => {
        userInfo.push({
          data: doc.data()
        })
      });
      this.setState({
        userInfo: userInfo,
        loader: false
      });
    });
  }

  getUserPosts() {
    let user = ''
    if(this.props.route.params?.user) {
      user = this.props.route.params.user;
    } else {
      user = auth.currentUser.email;
    }
    db.collection("posts").where("owner", '==', user).onSnapshot((docs) => {
      let userPosts = [];
      docs.forEach((doc) => {
        userPosts.push({
          id: doc.id,
          data: doc.data()
        })
      });
      this.setState({
        userPosts: userPosts,
        loader: false
      });
    });
  }

  logOut() {
    auth.signOut()
    this.props.navigation.navigate('Login')
  }

  componentDidMount() {
    console.log(this.props)
    this.getUserPosts()
    this.getUserData()
  }



  render() {
    return (
      <React.Fragment>
        {
          this.state.loader ?
            <ActivityIndicator size='large' color='black' />
            :
            <View>
              <View>
                
                <Text></Text>
                <Text></Text>
                <Text></Text>
              </View>

              <FlatList
                data={this.state.userPosts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <Post navigation={this.props.navigation} id={item.id} data={item.data} url={item.url} />} />
              <TouchableOpacity onPress={() => this.logOut()}>
                <Text style={styles.title}>logOut</Text>
              </TouchableOpacity>
            </View>
        }


      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({})