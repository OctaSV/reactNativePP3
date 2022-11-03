import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {auth} from '../firebase/config'

const styles = StyleSheet.create({
})

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            userName: '',
            biography: '',
            logued: false
        }
    }

    signUp(email, password){
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => this.setState({loged: true}))
        .then(() => (
            this.state.logued === true ? this.props.navigation.navigate('Login') : false    
        ))
        .catch(error => alert(error))
    }

    render(){
        return (
            <React.Fragment>
                <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('TabNavigation')}>
                    <Text>Home</Text>
                </TouchableOpacity>
                <View style={styles.container}>
                    <Text style={styles.titleRegister}>Register</Text>
                    <TextInput style={styles.input} keyboardType='email-address' placeholder='email' onChangeText={text => this.setState({email: text})} value={this.state.email} />
                    <TextInput style={styles.input} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={text => this.setState({password: text})} value={this.state.password}/>
                    <TextInput style={styles.input} keyboardType='default' placeholder='username' onChangeText={text => this.setState({userName: text})} value={this.state.userName}/>
                    <TextInput style={styles.input} keyboardType='default' placeholder='biography' onChangeText={text => this.setState({biography: text})} value={this.state.biography}/>
                    <TextInput style={styles.input} keyboardType='default' placeholder='photo'/>
                    <TouchableOpacity onPress={() => this.signUp(this.state.email, this.state.password)}>
                        <Text style={styles.buttinRegister}> Submit </Text>
                    </TouchableOpacity>
                </View>
            </React.Fragment>
        );
       }
}

export default Register;