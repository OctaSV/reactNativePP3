import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import firebase from 'firebase';
import {auth, GoogleProvider} from '../firebase/Config';

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
        flex: 2,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center'
    },
    box2: {
        flex: 7,
        alignItems: 'center',
        justifyContent: 'space-evenly'
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
    field: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        color: '#535353',
        borderRadius: 2,
        paddingLeft: 10,
        shadowOpacity: 20
    },
    submit: {
        padding: 10,
        color: 'white',
        backgroundColor: '#5c0931',
        borderRadius: 10
    }
})


export default Login;