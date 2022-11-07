import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import React, { Component } from 'react';
import { auth, db } from '../firebase/Config'
import Post from '../components/Post';

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      userInfo: [],
      loader: true,
      userData: ''
    }
}





  getUserData(data) {
    db.collection("posts").where("owner", '==', data).onSnapshot((docs) => {
      let userInfo = [];
      docs.forEach((doc) => {
        userInfo.push({ 
                id: doc.id, 
                data: doc.data(),
                updateProfile: 'no logued' 
        })
      });
      this.setState({
        userInfo: userInfo,
        loader: false
      });
    }); 
  }

  componentDidMount() {
    this.props.route.params.infoUser !== undefined ? this.state.userData = this.props.route.params.infoUser : this.state.userData = auth.currentUser.email
    this.getUserData(this.state.userData)  //se ejecuta una vez 
   
  
  }

  componentDidUpdate(){
    this.props.route.params.infoUser !== undefined ? this.state.userData = this.props.route.params.infoUser : this.state.userData = auth.currentUser.email
    this.getUserData(this.state.userData) //se actualiza con la nueva prop y toma los datos del usuario traido
    
  }
   
  
  render() {
    
    console.log(auth.currentUser.providerData)
    console.log(auth.currentUser.providerData)
    console.log(auth.currentUser.providerData)
    console.log(auth.currentUser.providerData)
    console.log(auth.currentUser.providerData)
    console.log(auth.currentUser.providerData)
    console.log(auth.currentUser.providerData)
    return (
      <View>
      {
        this.state.loader ? 
          <ActivityIndicator size='large' color='black'/>        
        :      
            <FlatList 
            data={this.state.userInfo}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <Post navigation={this.props.navigation} id={item.id} data={item.data} url={item.url}/>} />
        }
      
      </View>
    )
  }
}

const styles = StyleSheet.create({})