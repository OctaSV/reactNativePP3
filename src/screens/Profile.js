import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/Config'
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
        loader: false
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


  componentDidMount() {
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
            <View style={styles.containerr}>
              <View style={styles.pageTitle}>
                <Image source={this.state.userInfo[0]?.data.photo} style={styles.imagen} />
                <Text style={styles.texto}>{this.state.userInfo[0]?.data.biography}</Text>
                <Text style={styles.texto}>{this.state.userInfo[0]?.data.userName}</Text>
              </View>

              <FlatList
                //solucionar error virtualized list
                
                numColumns={3}
                horizontal={false}
               style={styles.flatList}
               numColumns={3}
                contentContainerStyle={{
                  backgroundColor:'#000',
                  padding:20
                }}
                columnWrapperStyle={{
                  backgroundColor:'red',
                  
                }}
               
                scrollEnabled
                data={this.state.userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Post style={styles.container} navigation={this.props.navigation} id={item.id} data={item.data} url={item.url} />} />
              <TouchableOpacity onPress={() => this.logOut()}>
                <Text style={styles.title}>logOut</Text>
              </TouchableOpacity>
            </View>
        }


      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({

  containerr: {
    height: '100vh',
    width: '100vw',
    margin: 'unset'
  },
  imagen: {
    height: '100px',
    width: '100px',
    borderRadius: '10px',
    borderColor: 'white'
  },
  pageTitle: {
    color: 'white',
    fontSize: 40,
    padding: 15,
    backgroundColor: '#5c0931',
    alignItems: 'center'
  },
  texto: {
    fontWeight: 'bold',
    color: 'white'

  },

  flatList: {
    
  },
  container: {

  }

})