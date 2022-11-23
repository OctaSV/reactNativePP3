import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

class User extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    user() {
        this.props.navigation.navigate('Go Back', {user: this.props.user.email})
    }
   
    render() {
        return (
          <TouchableOpacity onPress={() => this.user()}> 
            <View style={styles.padreR}> 
                <Image source={this.props.user.photo} style={styles.imagen}/> 
                <Text style={styles.texto}> Email: {this.props.user.email} Username: {this.props.user.userName} </Text>
            </View>
          </TouchableOpacity>  
          )
    }
}

const styles = StyleSheet.create({ 
    texto: {
        alignSelf: 'center',
    },
    imagen: {
        height: 70,
        width: 70,
        margin: 10,
        borderRadius: 30,
        borderColor: 'white'
      },
      padreR: {
        flexDirection: 'row'
      }
  
});

export default User;