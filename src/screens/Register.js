import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import {auth, db} from '../firebase/Config'

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

    signUp(email, password, biography, username){
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => this.setState({loged: true}))
       .then(() => {
        return(
           db.collection('users').add({
            username: username,
            email: email,
            createdAt: Date.now(),
            biography: biography, 
           }) 
        )
       })
        .then(() => (
            this.state.logued === true ? this.props.navigation.navigate('Login') : false    
        )) 

        .catch(error => alert(error))
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.titleBox}>FANATIC</Text>
                    <TextInput style={styles.field} keyboardType='email-address' placeholder='email' onChangeText={text => this.setState({email: text})} value={this.state.email} />
                    <TextInput style={styles.field} keyboardType='default' placeholder='password' secureTextEntry={true} onChangeText={text => this.setState({password: text})} value={this.state.password}/>
                    <TextInput style={styles.field} keyboardType='default' placeholder='username' onChangeText={text => this.setState({userName: text})} value={this.state.userName}/>
                    <TextInput style={styles.field} keyboardType='default' placeholder='biography' onChangeText={text => this.setState({biography: text})} value={this.state.biography}/>
                    <TextInput style={styles.field} keyboardType='default' placeholder='photo'/>
                    <TouchableOpacity onPress={() => this.signUp(this.state.email, this.state.password, this.state.biography, this.state.userName)} style={styles.submitBox}>
                        <Text style={styles.submit}> Submit </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ ()=> this.props.navigation.navigate('Login')}>
                        <Text>You already have an account?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
       }
}

const styles = StyleSheet.create({
    container: {
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        paddingStart: 100,
        paddingEnd: 100
    },
    box: {
        width: '80vw',
        height: '40vh',
        justifyContent: 'space-around',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15
    },
    titleBox: {
        fontSize: 40,
        paddingBottom: 10
    },
    field: {
        width: '60%',
        height: '20%',
        paddingLeft: 10
    },
    submitBox: {
        padding: 15,
        width: '10%',
        backgroundColor: '#5c0931',
        borderRadius: 15
    },
    submit: {
        color: 'white'
    }
})


export default Register;