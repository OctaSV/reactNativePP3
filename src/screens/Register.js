import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native'
import {auth, db} from '../firebase/Config'
import {storage} from '../firebase/Config'
import * as ImagePicker from 'expo-image-picker';
import MyCamera from '../components/MyCamera';
import Img from '../components/Img';

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            userName: '',
            biography: '',
            logued: false,
            emailIncomplete: false,
            passwordIncomplete: false,
            userNameIncomplete: false,
            errorMessage: '',
            urlAvatarNoBlob: '',
            urlAvatar: '',
            useCam: '',
            urlCamPhoto: '',
            compCamara: true
        }
    }

    /* pickImage(){
        // No permissions request is necessary for launching the image library
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All
        })
        .then((result) => {
            this.setState({
                urlAvatarNoBlob: result.uri
            })
            console.log(result);
            
        }).catch((err) => {
            console.log(err);
        });
    } */
    
    takePhoto(){
        this.setState({
            useCam: true
        })
    }

/*     removePickImage(){
        this.setState({
            urlAvatarNoBlob: '',
            urlCamPhoto: ''
        })
    } */

    onImageUpload(url){
        this.setState({
            avatarUrl: url
        })
    }
    
    urlCam(urlMyCamera){
        console.log(urlMyCamera);
        this.setState({
            urlAvatarNoBlob: urlMyCamera
        })
    }

/*     savePicture(){
        fetch(this.state.urlAvatarNoBlob)
        .then(response => response.blob())
        .then(image => {
            const ref = storage.ref(`avatars/${Date.now()}.jpg`)
            ref.put(image)
            .then(response =>{
                ref.getDownloadURL()
                .then(url => this.setState({urlAvatar: url}))
                .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    } */

    signUp(email, password, userName, biography, photo, CamImage, urlCamPhoto){
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            this.savePicture()
            db.collection('users').add({
                email: email,
                password: password,
                userName: userName,
                biography: biography, 
                photo: photo,
                createdAt: Date.now()
            }) 
        })
        .then(() => {
            this.setState({logued: true})
        })
        .then(() => (
            this.state.logued === true ? this.props.navigation.navigate('Login') : false    
        )) 
        .catch(error => alert(`Cannot regist the user: ${error}`)
        )
    }

    emailIncomplete(text){
         text === '' ?
            this.setState({
                emailIncomplete: true
            })
        :
            this.setState({
                emailIncomplete: false
            })
    }

    passwordIncomplete(text){
        text === '' ?
           this.setState({
               passwordIncomplete: true
           })
       :
           this.setState({
               passwordIncomplete: false
           })
    }

    userNameIncomplete(text){
    text === '' ?
       this.setState({
            userNameIncomplete: true
       })
   :
       this.setState({
           userNameIncomplete: false
       })
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.titleBox}><Text style={styles.title}>FNTIC</Text></View>
                    <View style={styles.containerInfo}>
                        <View style={styles.formContainer}>
                            <TextInput style={this.state.emailIncomplete !== true ? styles.field : styles.incompletedField} keyboardType='email-address' placeholder='Email' onChangeText={text => (this.setState({email: text}),  this.emailIncomplete(text))} value={this.state.email}/>
                            <TextInput style={this.state.passwordIncomplete !== true ? styles.field : styles.incompletedField} keyboardType='default' placeholder='Password' secureTextEntry={true} onChangeText={text => (this.setState({password: text}), this.passwordIncomplete(text))} value={this.state.password}/>
                            <TextInput style={this.state.userNameIncomplete !== true ? styles.field : styles.incompletedField} keyboardType='default' placeholder='Username' onChangeText={text => (this.setState({userName: text}), this.userNameIncomplete(text))} value={this.state.userName}/>
                            <TextInput style={styles.field} keyboardType='default' placeholder='Biography' onChangeText={text => this.setState({biography: text})} value={this.state.biography}/>
                        </View>
                        <View style={styles.avatarBox}>
                            <Img onImageUpload={(url => this.onImageUpload())}/>
{/*                             {this.state.useCam ? 
                                <MyCamera registerCam={this.state.useCam} urlCam={this.urlCam} onImageUpload={(url)=>this.onImageUpload(url)} stlye={styles.cam}/> 
                            : 
                                <Image source={this.state.urlAvatarNoBlob === '' && this.state.urlCamPhoto === '' ? require('../../assets/logo.png') : {uri: this.state.urlAvatarNoBlob !== '' ? this.state.urlAvatarNoBlob : this.state.urlCamPhoto}} style={styles.avatar}/>}
                                {this.state.urlAvatarNoBlob !== '' ? <TouchableOpacity onPress={()=> this.removePickImage()} style={styles.deleteAvatar}><Text>Remove</Text></TouchableOpacity> : <TouchableOpacity style={styles.addAvatar} onPress={()=> this.pickImage()}><Text>Avatar</Text></TouchableOpacity>}
                                <>
                                    <Image style={styles.image} source={{uri: this.state.urlCamPhoto}}/>
                                    {this.state.urlCamPhoto !== '' ? <TouchableOpacity onPress={()=> this.removePickImage()} style={styles.deleteAvatar}><Text>Remove</Text></TouchableOpacity> : <TouchableOpacity style={styles.addAvatar} onPress={()=> this.takePhoto()}><Text>Take a photo</Text></TouchableOpacity>}
                                </> */}
                        </View>
                    </View>
                    <View style={styles.submits}>
                        {
                            this.state.email === '' || this.state.password === '' || this.state.userName === '' ?
                                <View style={styles.submits}>
                                    <TouchableOpacity style={styles.notSubmitBox}>
                                        <Text onPress={()=> alert('Complete with the obligatory information')}> Submit </Text>
                                    </TouchableOpacity> 
                                    {this.state.errorMessage ? <Text style={styles.error}>{this.state.errorMessage}</Text> : false}
                                </View>
                            :
                                <View style={styles.submits}> 
                                    <TouchableOpacity style={styles.submitBox} onPress={() => this.signUp(this.state.email, this.state.password, this.state.userName, this.state.biography, this.state.urlAvatarNoBlob)}>
                                        <Text> Submit </Text>
                                    </TouchableOpacity>
                                    {this.state.errorMessage ? <Text style={styles.error}>{this.state.errorMessage}</Text> : false}
                                </View>     
                        }
                        <TouchableOpacity onPress={()=> this.props.navigation.pop()}>
                            <Text>You already have an account?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
       }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    box: {
        height: '60%',
        width: '90%',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingBottom: 15
    },
    titleBox: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 50
    },
    containerInfo: {
        flex: 3,
        width: '100%',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    field: {
        paddingLeft: 5,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderLeftColor: '#000000',   
        color: '#535353',
        textAlign: 'center',
        margin: 5
    },
    incompletedField: {
        paddingLeft: 5,
        borderWidth: 1,
        borderColor: 'red',
        borderLeftColor: 'redx', 
        borderRadius: 2,  
        color: 'red',
        textAlign: 'center',
        margin: 5
    },
    submits: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    submitBox: {
        padding: 5,
        backgroundColor: '#5c0931',
        borderRadius: 3
    },
    notSubmitBox: {
        backgroundColor: 'lightgray',
        padding: 3,
        borderRadius: 3
    },
    formContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarBox: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addAvatar: {
        justifyContent: 'center',
        padding: 3,
        backgroundColor: '#5c0931',
        borderRadius: 3,
        margin: 5
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 400,
        backgroundColor: 'gray',
        marginBottom: 5
    },
    deleteAvatar: {
        padding: 3,
        justifyContent: 'center',
        backgroundColor: '#5c0931',
        borderRadius: 3
    },
    cam:{
        width: 50,
        height: 50,
        borderRadius: 400,
        backgroundColor: 'gray',
        marginBottom: 5
    },
    error: {
        color: 'red'
    }
})


export default Register;