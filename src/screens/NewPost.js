import MyCamera from '../components/MyCamera'

import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/Config'

class NewPost extends Component {
  constructor(props){
    super(props)
    this.state={
        posteo:'',
        url: ''
    }
}

newPost(posteo, url){
  db.collection('posts').add({
    owner: auth.currentUser.email,
    post: posteo,
    url: url,
    createdAt: Date.now(),
    likes:[],
    comments: []
  })
  .then(() => {
    this.props.navigation.navigate('Home')
    this.setState({
      posteo:''
    })
  })
  .catch (err => console.log(err))
}

onImageUpload(url){
  this.newPost(this.state.posteo, url)
}

  render() {
    return (
      <>
        <Text>
            Estas por crear un nuevo post!!!
        </Text>
        <MyCamera onImageUpload={(url)=>this.onImageUpload(url)} stlye={styles.camera}/>
        <TextInput
          stlye={styles.form}
          keyboardType='default'
          placeholder='Tu nuevo posteo!'
          onChangeText={ text => this.setState({posteo:text}) }
          value={this.state.posteo} />

        <TouchableOpacity onPress={() => this.newPost(this.state.posteo)}>
          <Text>
            Subir
          </Text>
        </TouchableOpacity>
    </>
    )
  }
}

const styles = StyleSheet.create({
  container:{
      flex:1
  },
  form:{
    flex:1,
},
  camera:{
      flex:1,
  }
})

export default NewPost