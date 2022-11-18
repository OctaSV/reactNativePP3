import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/Config'
import Post from '../components/Post';
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: [],
      userPosts: [],
      loader: true,
      user: '',
      password: '',
      email: ''
    }
  }

  getUserData() {
    let user = ''
    if (this.props.route.params?.user) {
      user = this.props.route.params.user;

    } else {
      user = auth.currentUser.email;
    }
    //notar que si el mail esta mal escrito, te lo completa ejemplo nanci@gmail.con te devuelve nanci@gmail.com. Ademas si el mail es
    //USUARIOREAL@gmail.com te devuelve usuarioreal@gmail.com 
    db.collection("users").where("email", '==', user).onSnapshot((docs) => {
      let userInfo = [];
      docs.forEach((doc) => {
        userInfo.push({
          data: doc.data()
        })
      });
      this.setState({
        userInfo: userInfo,
        loader: false,
        user: user
      });
      console.log(user)
    });
  }

  getUserPosts() {
    let user = ''
    if (this.props.route.params?.user) {
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


  deleteAcc() {
    <View>
    <TextInput style={styles.field} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={ text => this.setState({password: text}) }/>
    <TextInput style={styles.field} keyboardType='email-address' placeholder='email' onChangeText={ text => this.setState({email: text}) }/>
    </View>
    email = this.state.email
    password = this.state.password
    const credential = auth.signInWithEmailAndPassword(email,password)
    auth.currentUser.reauthenticateWithCredential(credential).then(() => {
      console.log(credential)
    }).then(() => {
      auth.currentUser.delete().then(() => {
        this.props.navigation.navigate('Login')
      })
    })
    .catch((error) => {
     console.log(error)
    });
  }

  componentDidMount() {
    this.getUserPosts()
    this.getUserData()
  }



  render() {
    console.log(this.props.user)


    return (

      <React.Fragment>
        {
          this.state.loader ?
            <ActivityIndicator styles={styles.activity} size='large' color='black' />
            :
            this.state.user == auth.currentUser.email ?
              <View style={styles.container}>
                <View style={styles.pageTitle}>
                  <View style={styles.comandosOwner}>
                    <TouchableOpacity style={styles.comandosOwner.margen} onPress={this.deleteAcc() }> <Entypo name="trash" size={30} color="white" /></TouchableOpacity>
                    <TouchableOpacity onPress={this.logOut()}> <FontAwesome name="sign-out" size={30} color="white" /> </TouchableOpacity>
                  </View>
                  <Image source={this.state.userInfo[0]?.data.photo} style={styles.imagen} />
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
              </View> :
              <View style={styles.container}>
                <View style={styles.pageTitle}>
                  <Image source={this.state.userInfo[0]?.data.photo} style={styles.imagen} />
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
    alignItems: 'center'
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
  container: {
    flex: 1
  },
  comandosOwner: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    position: 'absolute',
    margen:
    {
      marginRight: 10
    }
  }

})