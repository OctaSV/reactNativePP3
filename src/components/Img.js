import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image} from 'react-native';
import { storage } from '../firebase/Config';
import * as ImagePicker from 'expo-image-picker';

class Img extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageEmpty: true
        }
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

    removeImage() {
        let image = ''
        this.props.onImageUpload(image)
        this.setState({imageEmpty: true})
    } 

    render(){
        return (
            <View >
                <View >
                    <TouchableOpacity onPress={() => this.pickImage()}>
                        <Text> Choose a picture </Text> 
                    </TouchableOpacity>
                    {
                        this.state.imageEmpty !== true ?
                            <TouchableOpacity onPress={() => this.removeImage()}>
                                <Text> Delete </Text> 
                            </TouchableOpacity>
                        :
                            false
                    }
                </View> 
            </View>
        );
      }

    }


export default Img; 