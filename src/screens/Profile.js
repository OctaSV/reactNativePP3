import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/Config'
import Post from '../components/Post';
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      userPosts: [],
      loader: true,
      userEmail: '',
      password: '',
      show: false,
      error: false
    }
  }

  getUserPosts(user) {
    console.log(user);
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
    //notar que si el mail esta mal escrito, te lo completa ejemplo nanci@gmail.con te devuelve nanci@gmail.com. Ademas si el mail es
    //USUARIOREAL@gmail.com te devuelve usuarioreal@gmail.com 
    db.collection("users").where("email", '==', user)
      .onSnapshot((docs) => {
        let userInfo = [];
        console.log(docs);
        docs.forEach((doc) => {
          userInfo.push({
            data: doc.data()
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
    
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password);
    
    auth.currentUser.reauthenticateWithCredential(credential).then(() => {
      console.log(credential)
    }).then(() => {
       auth.currentUser.delete().then(() => {
         this.props.navigation.navigate('Login')
        })
    })
      .catch((error) => {
        this.setState({
          error: true
        })
      });
  }

  componentDidMount() {
    this.getUserData()
  }


  render() {
    
    return (
      <React.Fragment>
        {
          this.state.loader ?
            <ActivityIndicator styles={styles.activity} size='large' color='black' />
            :
            <View style={styles.container}>
              <View style={styles.pageTitle}>
                {this.state.userEmail === auth.currentUser.email ?
                  <View style={styles.comandosOwner}>
                    <TouchableOpacity style={styles.comandosOwner.margen} onPress={() => this.setState({ show: true })}> <Entypo name="trash" size={30} color="white" /></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logOut()}> <FontAwesome name="sign-out" size={30} color="white" /> </TouchableOpacity>
                  </View>
                  :
                  false
                }
                {this.state.show === true ?
                  <View style={styles.comandosOwner}>
                    <TouchableOpacity style={styles.comandosOwner.margen} onPress={() => this.setState({ show: true })}> <Entypo name="trash" size={30} color="white" /></TouchableOpacity>
                    <TextInput style={styles.field} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={text => this.setState({ password: text })} />
                    <TouchableOpacity onPress={() => this.deleteAcc()} >
                      <Text style={styles.submit}> Borrar </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logOut()}> <FontAwesome name="sign-out" size={30} color="white" /> </TouchableOpacity>
                  </View>
                  : false
                }
                {this.state.error === true ?
                    
                    <Text style={styles.error}>Contrasena incorrecta!</Text>
          
                  : false
                }
                <Image source={this.state.userInfo[0]?.data.photo ? { uri: this.state.userInfo[0]?.data.photo } : require('../../assets/logo.jpg')} style={styles.imagen} />
                <Text style={styles.texto}>{this.state.userInfo[0]?.data.userName}</Text>
                <Text style={styles.texto.bio}>{this.state.userInfo[0]?.data.biography}</Text>
              </View>
              <FlatList
                //solucionar error virtualized list 
                data={this.state.userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Post
                  navigation={this.props.navigation}
                  id={item.id}
                  data={item.data}
                  url={item.url} />
                } />
            </View>
        }
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  pageTitle: {
    color: 'white',
    fontSize: 40,
    padding: 15,
    backgroundColor: '#5c0931',
    alignItems: 'center',
  },
  imagen: {
    height: 100,
    width: 100,
    borderRadius: 10,
    borderColor: 'white',
    marginTop: 50
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
  container: {
    flex: 1
  },
  comandosOwner: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    position: 'absolute',

    margen:
    {
      marginRight: 10,
    }
  },
  field: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
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
  marginTop: 50
}
})

export default Profile;