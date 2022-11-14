import { Text, View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { Component } from 'react'
import {db, auth} from '../firebase/Config'
import firebase from 'firebase'

class Post extends Component {
    constructor(props){
        super(props)
        this.state = {
            likesCount: props.data.likes.length,
            commentsCount: props.data.comments.length,
            myLike: false
        }
    }
    userProfile() {
        this.props.navigation.navigate('Go Back', {user: this.props.data.owner})
    }
    
    componentDidMount(){
        if (this.props.data.likes.includes(auth.currentUser.email)) {
            this.setState({
                myLike: true
            })
        }
    }

    like(){
        db.collection('posts').doc(this.props.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(() => {
            this.setState({
                myLike: true,
                likesCount: this.state.likesCount + 1
            })
        })
        .catch(err => console.log(err))
    }

    dislike(){
        db.collection('posts').doc(this.props.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(() => {
            this.setState({
                myLike: false,
                likesCount: this.state.likesCount - 1
            })
        })
        .catch(err => console.log(err))
    }

    deletePost(){

        db.collection('posts').doc(this.props.id).delete()

        //Con alertas, funciona en el celular no en la web

        // Alert.alert(`Eliminacion de posteo`, 'Estas seguro que desas eliminarlo?', [
        //     {
        //         text: 'Cancel'
        //     },
        //     {
        //         text:'Eliminar',
        //         onPress: () => db.collection('posts').doc(this.props.id).delete()
        //     }
        // ])
    }

  render() {
    return (
      <View>
        <Image style={styles.imagen} source={this.props.data.url}/>
        <TouchableOpacity onPress={()=> this.userProfile()}><Text>{this.props.data.owner}</Text></TouchableOpacity>   
        <Text> 
            Producto: {this.props.data.post}
        </Text>
        <Text>
            {this.state.commentsCount} comentarios
        </Text>
        <Text>
            {this.state.likesCount} likes
        </Text>

        {
            this.state.myLike 
            ? 
            <TouchableOpacity onPress={() => this.dislike()}>
                <Text>
                    Dislike
                </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => this.like()}>
                <Text>
                    Like
                </Text>
            </TouchableOpacity>
        }

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', {id: this.props.id, commentsData: this.props.data.comments})}>
            <Text>
                Agregar comentario
            </Text>
        </TouchableOpacity>
        
        {
            auth.currentUser.email === this.props.data.owner
            ?   <TouchableOpacity onPress={() => this.deletePost()}>
                    <Text>Eliminar posteo</Text>
                </TouchableOpacity>
            : <Text>No puedes borrar un post que no es tuyo!</Text>
        }
    </View>
    )
  }
}

const styles = StyleSheet.create({
    imagen:{
       height: 100,
       width: 100 
    }
  })

export default Post

//TAREAS
// 1. QUE CAMBIE EL NUMERO DE COMENTARIOS Y ELIMINAR POSTEO
// 2. ESTILOS