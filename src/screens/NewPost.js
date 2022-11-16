import MyCamera from '../components/MyCamera'
import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { db, auth } from '../firebase/Config'
import { AntDesign } from '@expo/vector-icons';

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
        posteo: '',
        compCamara: true
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
        : <View style={styles.container}>
          <Text style={styles.textEnc}>Estas por subir tu posteo!</Text>
        <Image style={styles.imagen} source={{uri: this.state.urlFoto}}/>
        <TextInput
        style={styles.form}
        keyboardType='default'
        placeholder='Descripcion de tu posteo'
        onChangeText={ text => this.setState({posteo:text}) }
        value={this.state.posteo} />
        <TouchableOpacity style={styles.text} onPress={() => this.newPost(this.state.posteo, this.state.urlFoto)}>
          <Text style={styles.text}>Subir a FNATIC</Text>
        </TouchableOpacity>
        </View>
      }
    </>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    width: '50%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
},
  form:{
    border: '2px solid #5c0931',
    marginBottom: '7px',
    padding: '5px',
    width: '408.800px'
},
  imagen:{
    height: '406.800px',
    width: '406.800px',
    marginBottom: '20px',
    marginTop: '20px' 
 },
 text:{
  fontSize: '20px',
  color: 'whitesmoke',
  backgroundColor: '#5c0931',
  fontWeight: 'bold',
  padding: '5px'
},
textEnc:{
  fontSize: '20px',
  marginTop: '20px'
}
})

export default NewPost