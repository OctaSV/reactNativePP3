import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/Config'
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
    
        }
    }

    user() {
        
    }

   
    render() {
       
        return (
            
          <TouchableOpacity onPress={() => this.user()}> <Text style={styles.texto}>Email: {this.props.user.email} </Text>
          </TouchableOpacity>  
        )
    }
}
const styles = StyleSheet.create({ 
    texto: {
        fontSize: 30,
        alignSelf: 'start',
        marginLeft: 35,
  
    }
})
export default User