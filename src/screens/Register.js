import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native'
import {auth, db} from '../firebase/Config'
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
            urlAvatarNoBlob: '',
            urlAvatar: '',
            logued: false,
            emailIncomplete: false,
            passwordIncomplete: false,
            userNameIncomplete: false,
            useCam: false,
            errorMessage: ''
        }
    }

    onImageUpload(image){
        this.setState({
            urlAvatarNoBlob: image
        })
    }

    savePhoto() {
        fetch(this.state.urlAvatarNoBlob) // me permite acceder el contenido de un archivo
            .then(res => res.blob()) // el metodo blob me permite tener la representacion binaria de mi imagen         
            .then(image => {
                const ref = storage.ref(`avatars/${Date.now()}.jpg`)
                ref.put(image) // subo a firebase el archivo
                    .then(() => {
                        ref.getDownloadURL()
                            .then(url => {
                                this.setState({
                                    urlAvatar: url
                                })
                            })
                            .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
    }

    allowTakePicture(){
        this.setState({
            useCam: true
        })
    }

    signUp(email, password, userName, biography, avatarUrl){
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            db.collection('users').add({
                email: email,
                password: password,
                userName: userName,
                biography: biography, 
                photo: avatarUrl,
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
                            {
                                this.state.useCam === false ?
                                <>
                                    <Image style={styles.avatar} source={this.state.urlAvatarNoBlob === '' ? require('../../assets/logo.png') : {uri: this.state.urlAvatarNoBlob}}/>
                                    <Img onImageUpload={url => this.onImageUpload(url)}/>
                                    <TouchableOpacity onPress={() => this.allowTakePicture()}><Text>Take a picture</Text></TouchableOpacity>
                                </>
                                :
                                    <MyCamera onImageUpload={(url => this.onImageUpload(url))}/>
                            }
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
                                    <TouchableOpacity style={styles.submitBox} onPress={() => (this.savePhoto(), this.signUp(this.state.email, this.state.password, this.state.userName, this.state.biography, this.state.urlAvatar))}>
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
        height: '95%',
        width: '95%',
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
        fontSize: 50,
        fontWeight: 350,
        color: '#5c0931'
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