import React, {Component} from 'react'
import {Camera} from 'expo-camera'
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native'
import {storage} from '../firebase/Config'

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
                permission:true,
                urlFoto:''
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
                    <Image
                    style={styles.camara}
                    source={{uri: this.state.urlFoto}}
                    />
                    <View>
                        <TouchableOpacity onPress={()=> this.savePicture()}>
                            <Text>
                                Confirmar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.discardPicture()}>
                            <Text>
                                Descartar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                : <View style={styles.container}>
                    <Camera
                    style={styles.camara}
                    type={Camera.Constants.Type.back}
                    ref={ (metodos) => this.metodosDeCamara = metodos}
                    />
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={()=> this.takePicture()}>
                            <Text>Tomar la foto</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            :
            <Text>No hay permisos</Text>
        }
        </>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    camara:{
        flex:1,
        height:'1000px',
        width:'300px'
    },
    buttons:{
        flex:1
    }
})

export default MyCamera