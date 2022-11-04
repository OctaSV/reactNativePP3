import MyCamera from '../components/MyCamera'

import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db, auth } from '../firebase/Config'

class NewPost extends Component {
  constructor(props){
    super(props)
    this.state={
        posteo:'',
        urlFoto: '',
        compCamara: true
    }
}

onImageUpload(url){
  this.setState({
    urlFoto: url,
    compCamara: false
})
}

newPost(posteo, urlFoto){
  db.collection('posts').add({
    owner: auth.currentUser.email,
    post: posteo,
    url: urlFoto,
    createdAt: Date.now(),
    likes:[],
    comments: []
  })
  .then(() => {
    this.props.navigation.navigate('Home')
    this.setState({
      compCamara: true,
      posteo: ''
    })
  })
  .catch (err => console.log(err))
}

  render() {
    return (
      <>
      {
        this.state.compCamara 
        ? <MyCamera onImageUpload={(url)=>this.onImageUpload(url)} stlye={styles.camera}/>
        : <>
        <Image style={styles.imagen} source={{uri: this.state.urlFoto}}/>
        <TextInput
        stlye={styles.form}
        keyboardType='default'
        placeholder='Tu nuevo posteo!'
        onChangeText={ text => this.setState({posteo:text}) }
        value={this.state.posteo} />
        <TouchableOpacity onPress={() => this.newPost(this.state.posteo, this.state.urlFoto)}>
            <Text>
              Subir
            </Text>
          </TouchableOpacity>
        </>
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
  },
  imagen:{
    width:'200px',
    height: '300px'
  }
})

export default NewPost