import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {auth, GoogleAuthProvider} from '../firebase/Config';

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
        auth.signInWithPopup(GoogleAuthProvider)
        .then((result) => {
            console.log(result)
            this.setState({
                email: result,
                password: result,
                logued: true
            })
        })
        .then(() => (
            this.state.logued !== false ? this.props.navigation.navigate('Home') : false    
        ))
        .catch(error => console.log(error)) 
    }

    render(){
        return (
            <React.Fragment>
                {
                    this.state.loader === true ? 
                        <ActivityIndicator size='large' color='green'/>
                    :
                        <View style={styles.container}>
                            <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('TabNavigation')}>
                                <Text style={styles.title}>Welcome fanatic</Text>
                            </TouchableOpacity>
                            <View style={styles.box}>
                                <Text style={styles.titleBox}>FANATIC</Text>
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
        width: '90%',
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