import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

class MyCamera extends Component {
    constructor(props){
        super(props)
        this.state = {
            permission: false,
            mostrarCamara: true,
            urlFoto:''
        }
    }

    componentDidMount(){
        Camera.requestCameraPermissionsAsync()
        .then(() => {
            this.setState({
                permission: true
            })
        })
        .catch(error => console.log(error))
    }

    takePicture(){
        this.metodosDeCamara.takePictureAsync()
        .then(image => {
            this.setState({
                urlFoto: image.uri
            })
            this.props.onImageUpload(image.uri)
        })
        .catch(error => console.log(error))
    }

    discardPostPicture(){
        this.setState({
            urlFoto:'',
            mostrarCamara:true
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.permission ?
                    !this.props.forRegister ?
                        <View style={styles.container}>
                            <Text style={styles.text}>Take a picture for fanatics</Text>
                            <Camera
                            style={styles.camara}
                            type={Camera.Constants.Type.back}
                            ref={ (metodos) => this.metodosDeCamara = metodos}
                            />
                            <View style={styles.buttons}>
                                <TouchableOpacity onPress={()=> this.takePicture()}>
                                    <Ionicons name="radio-button-on-outline" size={48} color="#5c0931" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    :
                        <View style={styles.container}>
                            <Camera
                            style={styles.camara}
                            type={Camera.Constants.Type.back}
                            ref={ (metodos) => this.metodosDeCamara = metodos}
                            />
                            <View style={styles.buttons}>
                                <TouchableOpacity onPress={()=> this.takePicture()}>
                                    <Ionicons name="radio-button-on-outline" size={48} color="#5c0931" />
                                </TouchableOpacity>
                            </View>
                        </View>
                :
                    <ActivityIndicator style={styles.activity} size='large' color='#5c0931'/>
                }
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto'
    },
    camara:{
        flex: 4,
        marginHorizontal: 10,
        width: '100%'
    },
    buttons:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontSize: 20,
        textShadowRadius: 10,
        backgroundColor: '#5c0931',
        borderRadius: 10,
        fontWeight: 'bold',
        color: 'white',
        padding: 15,
        margin: 15
    },
    imagen:{
        width: '100%',
        marginHorizontal: 10
     },
     activity: {
        marginTop: 250
     }
});

export default MyCamera;