import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image} from 'react-native';
import { storage } from '../firebase/config';
import * as ImagePicker from 'expo-image-picker';

class Img extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: ''
        }
    }

    pickImage() {
        // No permissions request is necessary for launching the image library
        ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All
        })
        .then(image => {
            this.setState({
                 image: image.uri
            })
        })
        .catch(error => console.log(e))
    };

    saveImage() {
        fetch(this.state.image)
            .then(response => response.blob()) //representacion binaria de mi imagen         
            .then(image => {
                const ref = storage.ref(`avatars/${Date.now()}.jpg`)
                ref.put(image) // subo a firebase el archivo
                    .then(() => {
                        ref.getDownloadURL()
                        .then(urlImage => {
                            this.props.onImageUpload(urlImage);
                        })
                        .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    }

    removeImage() {
        this.setState({
            image: ''
        })
    } 

      render(){
        return (
            <View >
                <View >
                    <TouchableOpacity onPress={() => this.pickImage()}>
                        <Text> Avatar </Text> 
                    </TouchableOpacity>
                    {<Image source={{ uri: this.state.image }} style={{ width: 50, height: 50 }} />}
                </View> 
            </View>
        );
      }

    }


export default Img; 