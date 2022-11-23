import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

class Img extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    pickImage() {
        // No permissions request is necessary for launching the image library
        ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All
        })
        .then(image => {
            this.props.onImageUpload(image.uri)
            this.setState({imageEmpty: false})
        })
        .catch(error => console.log(error))
    }

    render(){
        return (
            <View>
                <TouchableOpacity style={styles.choose} onPress={() => this.pickImage()}>
                    <Text style={styles.text}> Choose a picture </Text> 
                </TouchableOpacity>
            </View> 
        );
      }

}

const styles = StyleSheet.create({
    choose: {
        backgroundColor: '#5c0931',
        padding: 10,
        color: 'white',
        borderRadius: 10,
        marginBottom: 20
    },
    text: {
        color: 'white'
    }
});

export default Img; 