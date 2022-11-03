import React, { Component } from 'react';
import { StyleSheet, Text, TextComponent, View, TouchableOpacity } from 'react-native';
import {auth} from '../firebase/config'

const styles = StyleSheet.create({
})

class Home extends Component{
    constructor(){
        super();
        this.state = {
            logueado: false
        }
    }


    render() {
        return(
            <View>Hola Mundo</View>
        )
    }
}

export default Home;