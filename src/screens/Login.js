import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, GoogleProvider } from '../firebase/Config';
import firebase from 'firebase';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            loader: true,
            email: '',
            password: '',
            logued: false,
            errorMessage: ''
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
            if (this.state.logued) {
                this.props.navigation.navigate('Home')
            }
        })
        .catch(error => this.setState({errorMessage: error.message}))
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
                        <ActivityIndicator style={styles.activity} size='large' color='#5c0931'/>
                    :
                        <View style={styles.container}>
                            <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('TabNavigation')} style={styles.titleBox}>
                                <Text style={styles.title}>Welcome, fanatic</Text>
                            </TouchableOpacity>
                            <View style={styles.box}>
                                <View style={styles.boxtitle2}>
                                    <Text style={styles.title2}>FNATIC</Text>
                                </View>
                                <View style={styles.box2}>
                                    <View style={styles.box2.boxLog}>
                                        <TextInput style={styles.box2.boxLog.field} keyboardType='email-address' placeholder='email' onChangeText={ text => this.setState({email: text}) }/>
                                        <TextInput style={styles.box2.boxLog.field} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={ text => this.setState({password: text}) }/>
                                        {
                                            this.state.password === '' || this.state.email === '' ?
                                                <TouchableOpacity style={styles.box2.boxLog.boxSubmit} onPress={() => this.setState({errorMessage: 'Incomplete field'})} >
                                                    <Text style={styles.box2.boxLog.boxSubmit.notSubmit}> Submit </Text>
                                                </TouchableOpacity>
                                            :
                                                <TouchableOpacity style={styles.box2.boxLog.boxSubmit} onPress={() => this.signIn(this.state.email, this.state.password)} >
                                                    <Text style={styles.box2.boxLog.boxSubmit.submit}> Submit </Text>
                                                </TouchableOpacity>
                                        }
                                        {
                                            this.state.errorMessage ?
                                                <Text style={styles.box2.boxLog.errorMessage}>{this.state.errorMessage}</Text>
                                            :
                                                false
                                        }
                                    </View>
                                    <View style={styles.box2.boxLog.boxAdd}>
                                        <TouchableOpacity style={styles.google} onPress={() => this.signGoogle()}>                            
                                            <Text>Google</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>                            
                                            <Text>You are not in yet?</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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
        allowContent : "center",
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    titleBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    box: {
        flex: 3,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    boxtitle2: {
        flex: 1.5,
        justifyContent: 'center'
    },  
    title2: {
        fontSize: 30,
        padding: 10,
        fontWeight: 350,
        color: '#5c0931'
    },
    box2: {
        flex: 7,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        boxLog: {
            flex: 1,
            width: '100%',
            justifyContent: 'space-evenly',
            textAlign: 'center',
            alignItems:'center',
            field: {
                width: '80%',
                borderWidth: 1,
                borderColor: '#CCCCCC',
                color: '#535353',
                borderRadius: 1,
                paddingLeft: 10,
                shadowOpacity: 20
            },
            boxSubmit: {
                width: '25%',
                submit: {
                    padding: 5,
                    color: 'white',
                    backgroundColor: '#5c0931',
                    borderRadius: 5
                },
                notSubmit: {
                    padding: 5,
                    color: 'black',
                    backgroundColor: 'lightgray',
                    borderRadius: 5
                }
            },
            errorMessage: {
                color: 'red',
                textAlign: 'center'
            },
            boxAdd: {
                flex: 0.5,
                justifyContent: 'space-evenly',
                alignContent: 'center',
                textAlign: 'center'
            }
        }
    }
});

export default Login;