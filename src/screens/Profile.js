import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { auth, db } from '../firebase/Config'
import Post from '../components/Post';

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      userInfo: [],
      loader: true,
      user: ''
    }
  }

  getUserData(user) {
    db.collection("posts").where("owner", '==', user).onSnapshot((docs) => {
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

  logOut(){
    auth.signOut()
    this.props.navigation.navigate('Login')
  }

  componentDidMount() {
    this.getUserData(this.props.route.params.user)
  }

  componentDidUpdate(){
    this.getUserData(this.props.route.params.user)
  }
   
  
  render() {
    return (
      <React.Fragment>
      {
        this.state.loader ? 
          <ActivityIndicator size='large' color='black'/>        
        :      
            <>            
              <FlatList 
              data={this.state.userInfo}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => <Post navigation={this.props.navigation} id={item.id} data={item.data} url={item.url}/>} />
              <TouchableOpacity onPress={ ()=> this.logOut()}>
                <Text style={styles.title}>logOut</Text>
              </TouchableOpacity>
            </>
      }
      

      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({})