import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import {auth} from '../firebase/Config'

const styles = StyleSheet.create({

})

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
            if (user !== null) {
                this.props.navigation.navigate('TabNavigation')
            } else {
                this.setState({
                    loader: false
                })
            }
        })
    }

    signIn(email, password){
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            this.setState({
                logued:true
            })
        })
        .then(() => (
            this.state.in === true ? this.props.navigation.navigate('Home') : false    
        ))
        .catch(error => alert(error)) 
    }

    render(){
        return (
            <React.Fragment>
                {
                    this.state.loader === true ? 
                        <ActivityIndicator size='large' color='green'/>
                    :
                        <>
                            <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('TabNavigation')}>
                                <Text>Home</Text>
                            </TouchableOpacity>
                            <View style={styles.container}>
                                <Text style={styles.titleLogin}>Login</Text>
                                <TextInput style={styles.field} keyboardType='email-address' placeholder='email' onChangeText={ text => this.setState({email: text}) }/>
                                <TextInput style={styles.field} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={ text => this.setState({password: text}) }/>
                                <TouchableOpacity onPress={() => this.signIn(this.state.email, this.state.password)}>
                                    <Text style={styles.buttonLogin}> Submit </Text>
                                </TouchableOpacity>
                                <Text>{this.state.errorMessage}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>                            
                                    <Text>You are not in yet?</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                }
            </React.Fragment>
        );
    }
}

export default Login;