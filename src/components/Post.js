import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
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

  render() {
    return (
      <View>
        <Image style={styles.imagen} source={this.props.data.url}/>

        <Text>
            {this.props.data.owner} - {this.props.data.post}
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

        <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', {id: this.props.id, comentarito: this.props.data.comments})}>
            <Text>
                Agregar comentario
            </Text>
        </TouchableOpacity>
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