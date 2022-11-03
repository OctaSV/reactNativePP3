import MyCamera from '../components/MyCamera'

import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase/Config'

class NewPost extends Component {
  constructor(props){
    super(props)
    this.state={
        posteo:'',
        urlFoto: ''
    }
}

onImageUpload(url){
  this.setState({
    urlFoto: url
})
}

newPost(posteo){
  db.collection('posts').add({
    owner: auth.currentUser.email,
    post: posteo,
    url: this.state.urlFoto,
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

  render() {
    return (
      <>
        <MyCamera onImageUpload={(url)=>this.onImageUpload(url)} stlye={styles.camera}/>
        <TextInput
          stlye={styles.form}
          keyboardType='default'
          placeholder='Tu nuevo posteo!'
          onChangeText={ text => this.setState({posteo:text}) }
          value={this.state.posteo} />

          {this.state.urlFoto == '' && this.state.posteo == '' 
          ? <Text>Aun no puedes subir el posteo, tomate una foto y ponele descripcion!</Text>
          : <TouchableOpacity onPress={() => this.newPost(this.state.posteo)}>
              <Text>
                Subir
              </Text>
            </TouchableOpacity>
          }
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