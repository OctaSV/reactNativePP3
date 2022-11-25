import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native'
import { db, auth } from '../firebase/Config'
import { FontAwesome } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';
import Post from '../components/Post';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      userPosts: [],
      loader: true,
      userEmail: '',
      password: '',
      error: false,
      input: false,
    }
  }

  getUserPosts(user) {
    db.collection("posts").where("owner", '==', user).orderBy('createdAt', 'desc').onSnapshot((docs) => {
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

  getUserData() {
    let user = ''
    if (this.props.route.params) {
      user = this.props.route.params.user
    } else {
      user = auth.currentUser.email
    }
    db.collection("users").where("email", '==', user)
      .onSnapshot((docs) => {
        let userInfo = [];
        docs.forEach((doc) => {
          userInfo.push({
            data: doc.data(),
            id: doc.id
          })
        });
        this.setState({
          userInfo: userInfo,
          userEmail: user,
          loader: false
        });
        this.getUserPosts(user)
      });

  }

  logOut() {
    auth.signOut()
    this.props.navigation.navigate('Login')
  }

  deleteAcc() {
    const email = auth.currentUser.email
    const password = this.state.password
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    if (confirm('Are you sure?') == true) {
      auth.currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          auth.currentUser.delete()
          this.props.navigation.navigate('Login')
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            error: true
          })
        });
        db.collection("users").doc(this.state.userInfo[0].id).delete()
        this.state.userPosts.forEach((element)=> {
        db.collection("posts").doc(element.id).delete()
      })
    } else {
      false
    }
  }

  componentDidMount() {
    this.getUserData()
  }

  render() {
    console.log(this.state.userPosts);
    return (
      <React.Fragment>
        {
          this.state.loader ?
            <ActivityIndicator styles={styles.activity} size='large' color='#5c0931' />
            :
            <View style={styles.container}>
              <View style={styles.pageTitle}>
                {this.state.userEmail === auth.currentUser.email ?
                  <View style={styles.outFunct}>
                    <TouchableOpacity onPress={() => this.setState({
                      input: true
                      })}>
                      <Entypo name="trash" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logOut()}><FontAwesome name="sign-out" size={30} color="white" /></TouchableOpacity>
                  </View>
                  :
                  false
                }
                {
                  this.state.input ?
                    <View style={styles.borrar}>
                      <TextInput style={styles.field} keyboardType='default' placeholder='Put your password' secureTextEntry={true} onChangeText={text => this.setState({ password: text })} value={this.state.password} />
                      <TouchableOpacity style={styles.submit} onPress={() => this.deleteAcc()} >
                        <Text> Delete </Text>
                      </TouchableOpacity>
                    </View>
                    : false
                }
                {
                  this.state.error ? <Text style={styles.error}> Incorrect password. </Text> : false
                }
                <Image source={this.state.userInfo[0]?.data.photo ? { uri: this.state.userInfo[0]?.data.photo } : require('../../assets/logo.jpg')} style={styles.imagen} />
                <Text style={styles.texto}>{this.state.userInfo[0]?.data.userName}</Text>
                <Text style={styles.texto.bio}>{this.state.userInfo[0]?.data.biography}</Text>
                <Text style={styles.texto.bio}>{this.state.userInfo[0]?.data.email}</Text>
                <Text style={styles.texto.bio}>Posts: {this.state.userPosts.length}</Text>
              </View>
              {this.state.userPosts.length !== 0 ?
                <FlatList
                  data={this.state.userPosts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <Post
                    navigation={this.props.navigation}
                    id={item.id}
                    data={item.data}
                    url={item.url} />
                  } />
                :
                <View style={styles.container}>
                  <Text style={styles.nothingText}>There is nothing yet...</Text>
                </View>
              }
            </View>
        }
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageTitle: {
    color: 'white',
    fontSize: 40,
    padding: 15,
    backgroundColor: '#5c0931',
    alignItems: 'center',
    justifyContent: 'center'
  },
  outFunct: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    delete: {
    }
  },
  imagen: {
    height: 100,
    width: 100,
    borderRadius: 10,
    borderColor: 'white'
  },
  texto: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
    bio: {
      fontWeight: 'normal',
      color: 'white',
      fontSize: 15
    }
  },
  activity: {
    marginTop: 250
  },
  field: {
    borderWidth: 1,
    backgroundColor: 'white',
    color: '#535353',
    borderRadius: 2,
    paddingLeft: 10,
    shadowOpacity: 20,
  },
  submit: {
    padding: 10,
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 6
  },
  error: {
    color: 'red',
    backgroundColor: 'grey',
    borderRadius: 50,
    marginBottom: 10
  },
  nothingText: {
    textAlign: 'center',
    color: '#5c0931',
    paddingVertical: 20
  },
  borrar: {
  flexDirection: 'row',
  marginBottom: 10,
  justifyContent: 'flex-end'
  }
})

export default Profile;