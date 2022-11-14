import { Text, View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { Component } from 'react'
import {db, auth} from '../firebase/Config'
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';

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

    setCommentsCount(num) {
        this.setState({
            commentsCount: num
        })
    }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={()=> this.userProfile()}><FontAwesome name="user" size={24} color="black" /><Text>{this.props.data.owner}</Text></TouchableOpacity> 
        <Image style={styles.imagen} source={this.props.data.url}/>
        <Text style={styles.text}> 
            Producto: {this.props.data.post}
        </Text>
        {
            this.state.myLike 
            ? 
            <TouchableOpacity onPress={() => this.dislike()}>
                <Ionicons name="heart-sharp" size={24} color="black" />
                <Text>
                    {this.state.likesCount} likes
                </Text>
            </TouchableOpacity>
            
            :
            <TouchableOpacity onPress={() => this.like()}>
                <Ionicons name="heart-outline" size={24} color="black" />
                <Text>
                    {this.state.likesCount} likes
                </Text>
            </TouchableOpacity>
        }

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', {id: this.props.id, commentsData: this.props.data.comments, setCommentsCount: (num) => this.setCommentsCount(num)})}>
            <FontAwesome name="comment-o" size={24}  />
            <Text>
                {this.state.commentsCount} comentarios
            </Text>
        </TouchableOpacity>
        
        {
            auth.currentUser.email === this.props.data.owner
            ?   <TouchableOpacity onPress={() => this.deletePost()}>
                    <Text>Eliminar posteo</Text>
                </TouchableOpacity>
            :   <TouchableOpacity onPress={() => console.log('Denunciaste gorra!')}>
                    <Text>
                        Denunciar posteo --- desarrollo
                    </Text>
                </TouchableOpacity>
        }
    </View>
    )
  }
}

const styles = StyleSheet.create({
    imagen:{
       height: '250px',
       width: '250px' 
    },
    text: {
        fontSize: '20px'
    }
  })

export default Post

//TAREAS
// 1. QUE CAMBIE EL NUMERO DE COMENTARIOS Y ELIMINAR POSTEO
// 2. ESTILOS