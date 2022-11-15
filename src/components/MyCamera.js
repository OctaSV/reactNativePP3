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
        .then(response => {
            this.setState({
                permission:true
            })
        })
        .catch(error => console.log(error))
    }

    takePicture(){
        this.metodosDeCamara.takePictureAsync()
        .then(response => {
            this.setState({
                urlFoto: response.uri,
                mostrarCamara: false
            })

        })
        .catch(error =>console.log(error))
    }

    savePicture(){
        fetch(this.state.urlFoto)
        .then(response => response.blob())
        .then(image => {
            const ref = storage.ref(`photos/${Date.now()}.jpg`)
            ref.put(image)
            .then(response =>{
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

    discardPicture(){
        this.setState({
            urlFoto:'',
            mostrarCamara:true
        })
    }


  render() {
    return (
        <>
        {this.state.permission ?
                this.state.mostrarCamara === false ?
                <View style={styles.container}>
                    <Text style={styles.text}>Confirma o descarta la foto</Text>
                    <Image
                    style={styles.imagen}
                    source={{uri: this.state.urlFoto}}
                    />
                    <View style={styles.containerEl}>
                        <TouchableOpacity onPress={()=> this.discardPicture()}>
                            <Entypo name="cross" size={48} color="#5c0931" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.savePicture()}>
                            <FontAwesome5 name="arrow-alt-circle-right" size={48} color="#5c0931" />
                        </TouchableOpacity>
                    </View>
                </View>

                : <View style={styles.container}>
                    <Text style={styles.text}>Toma una foto para subir a Fnatic</Text>
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
            <ActivityIndicator size='large' color='#5c0931'/>
        }
        </>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width: '50%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto'
    },
    camara:{
        flex:2,
        width: '406.800px',
        marginTop: '20px',
        marginBottom: '20px',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontSize: '20px',
        marginTop: '20px'
    },
    imagen:{
        height: '406.800px',
        width: '406.800px',
        marginBottom: '20px',
        marginTop: '20px' 
     },
     containerEl:{
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: '437px'
     }
})

export default MyCamera