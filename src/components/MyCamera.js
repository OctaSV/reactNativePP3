import React, {Component} from 'react'
import {Camera} from 'expo-camera'
import {View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native'
import {storage} from '../firebase/Config'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';


class MyCamera extends Component {
    constructor(props){
        super(props)
        this.state = {
            permission:false,
            mostrarCamara:true,
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
                urlFoto: image.uri,
                mostrarCamara: false
            })
            this.props.onImageUpload(image.uri)
        })
        .catch(error =>console.log(error))
    }

    savePostPicture(){
        fetch(this.state.urlFoto)
        .then(response => response.blob())
        .then(image => {
            const ref = storage.ref(`photos/${Date.now()}.jpg`)
            ref.put(image)
            .then(() =>{
                ref.getDownloadURL()
                .then(url => this.props.onImageUpload(url))
                .catch(error => console.log(error))
            }
            )
            .catch(error => console.log(error))
        }
        )
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
                            this.state.mostrarCamara === false ?
                                <View style={styles.container}>
                                    <Image
                                    style={styles.imagen}
                                    source={{uri: this.state.urlFoto}}
                                    />
                                    <View style={styles.containerEl}>
                                        <TouchableOpacity onPress={()=> this.discardPostPicture()}>
                                            <Entypo name="cross" size={48} color="#5c0931" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=> this.savePostPicture()}>
                                            <FontAwesome5 name="arrow-alt-circle-right" size={48} color="#5c0931" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            : 
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
                        this.state.mostrarCamara === false ?
                            false
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
})

export default MyCamera