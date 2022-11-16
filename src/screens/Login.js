import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import firebase from 'firebase';
import {auth, GoogleProvider} from '../firebase/Config';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            loader: true,
            email: '',
            password: '',
            logued: false
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged(user => {
            user !== null ? this.props.navigation.navigate('TabNavigation') : this.setState({loader: false})
        })
    }

    signIn(email, password){
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            this.setState({
                logued: true
            })
        })
        .then(() => (
            this.state.logued !== false ? this.props.navigation.navigate('Home') : false    
        ))
        .catch(error => alert(error)) 
    }

    signGoogle(){
        firebase.auth()
        .signInWithPopup(GoogleProvider)
        .then((result) => {      
          // This gives you a Google Access Token. You can use it to access the Google API.
          // The signed-in user info.
          const user = result.user;
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
          // ...
        });
    }

    render(){
        return (
            <React.Fragment>
                {
                    this.state.loader === true ? 
                        <ActivityIndicator size='large' color='#5c0931'/>
                    :
                        <View style={styles.container}>
                            <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('TabNavigation')}>
                                <Text style={styles.title}>Welcome fanatic</Text>
                            </TouchableOpacity>
                            <View style={styles.box}>
                                <Text style={styles.titleBox}>FNATIC</Text>
                                <TextInput style={styles.field} keyboardType='email-address' placeholder='email' onChangeText={ text => this.setState({email: text}) }/>
                                <TextInput style={styles.field} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={ text => this.setState({password: text}) }/>
                                <TouchableOpacity onPress={() => this.signIn(this.state.email, this.state.password)} >
                                    <Text style={styles.submit}> Submit </Text>
                                </TouchableOpacity>
                                <Text>{this.state.errorMessage}</Text>
                                <TouchableOpacity onPress={() => this.signGoogle()}>                            
                                    <Text>Google</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>                            
                                    <Text>You are not in yet?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100vw',
        height: '100vh',
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 100,
        paddingEnd: 100
    },
    title: {
        flex: 1,
        fontSize: 125,
        width: '60vw',
    },
    titleBox: {
        fontSize: 40,
        paddingBottom: 10
    },
    box: {
        flex: 2,
        width: '40vw',
        height: '50vh',
        justifyContent: 'space-around',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15
    },
    field: {
        marginTop: 5,
        padding: 7,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        color: '#535353',
        width: '90%',
        borderRadius: 5,
        height: '10%',
        paddingLeft: 10,
        shadowOpacity: 20
    },
    submit: {
        padding: 20,
        color: 'white',
        backgroundColor: '#5c0931',
        borderRadius: 15
    }
})


export default Login;