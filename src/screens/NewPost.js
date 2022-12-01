import React, { Component } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import { db, auth, storage } from '../firebase/Config'
import MyCamera from '../components/MyCamera';
import Img from '../components/Img';

class NewPost extends Component {
  constructor(props){
    super(props)
    this.state={
        posteo:'',
        urlFoto: '',
        urlFotoDownload: '',
        compCamara: true
    }
  }

  componentDidMount(){
    this.props.navigation.addListener('tabPress', () => this.setState({compCamara: true}))
  }

  onImageUpload(url){
    this.setState({urlFoto: url, compCamara: false})
  }

  savePostPhoto(url){
    fetch(url)
    .then(response => response.blob())
    .then(image => {
        const ref = storage.ref(`photos/${Date.now()}.jpg`)
        ref.put(image)
        .then(() => {
          ref.getDownloadURL()
          .then(url => {
            this.newPost(this.state.posteo, url)
          })
          .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
  }

  newPost(posteo, urlFotoDownload){
    db.collection('posts').add({
      owner: auth.currentUser.email,
      post: posteo,
      url: urlFotoDownload,
      createdAt: Date.now(),
      likes:[],
      comments: []
    })
    .then(() => {
      this.setState({compCamara: false, posteo: ''})
      this.props.navigation.goBack()
    })
    .catch (err => console.log(err))
  }

  retake(){
    this.setState({
      compCamara: true
    })
  }

  render() {
    return (
        this.state.compCamara ?
          <View style={styles.container1}>
            <MyCamera onImageUpload={(url)=>this.onImageUpload(url)} stlye={styles.camera}/>
            <Img onImageUpload={(url)=>this.onImageUpload(url)} stlye={styles.imgComp}/>
          </View> 
        : 
          <View style={styles.container2}>
            <Text style={styles.textEnc}>Last step!</Text>
            <View>
              <Image style={styles.imagen} source={{uri: this.state.urlFoto}}/>
              <TouchableOpacity style={styles.retake} onPress={() => this.retake()}>
                <Text style={styles.textRetake}>Change</Text>
              </TouchableOpacity>
            </View>
            <TextInput
            style={styles.form}
            keyboardType='default'
            placeholder='Post description'
            onChangeText={ text => this.setState({posteo:text}) }
            value={this.state.posteo} />
            <TouchableOpacity style={styles.text} onPress={() => this.savePostPhoto(this.state.urlFoto)}>
              <Text style={styles.text}>Send to FNATIC</Text>
            </TouchableOpacity>
          </View>
    )
  }
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  }, 
  camera: {
    flex: 1
  },
  imgComp: {
    flex: 1,
    backgroundColor: '#5c0931',
    paddingBottom: 20
  },
  imagen:{
    height: 450,
    width: 450,
    position: 'relative'
  },
  text:{
    fontSize: 20,
    color: 'whitesmoke',
    backgroundColor: '#5c0931',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10
  },
  container2:{
    flex: 1,
    width: '100vw',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-evenly'
  },
  form:{
    width: '90%',
    border: '2px solid #5c0931',
    padding: 5,
  },
  textEnc:{
    width: '100%',
    padding: 30,
    fontSize: 20,
    textShadowRadius: 10,
    backgroundColor: '#5c0931',
    fontWeight: 'bold',
    color: 'white',
  },
  retake: {
    color: 'whitesmoke',
    backgroundColor: '#5c0931',
    padding: 10,
    borderRadius: 3,
    marginTop: 5
  },
  textRetake: {
    color: 'whitesmoke'
  }
})

export default NewPost