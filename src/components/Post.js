import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/Config'
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            likesCount: props.data.likes.length,
            commentsCount: props.data.comments.length,
            myLike: false,
            comentarios: [],
            comment: ''
        }
    }

    userProfile() {
        this.props.navigation.navigate('Go Back', { user: this.props.data.owner })
    }

    componentDidMount() {
        if (this.props.data.likes.includes(auth.currentUser.email)) {
            this.setState({
                myLike: true
            })
        };

        db.collection('posts')
            .doc(this.props.id)
            .onSnapshot(doc => {
                this.setState({
                    comentarios: doc?.data()?.comments
                })
            })

    }

    like() {
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

    dislike() {
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

    deletePost() {
        db.collection('posts').doc(this.props.id).delete()
    }

    setCommentsCount(num) {
        this.setState({
            commentsCount: num
        })
    }

    comment(comentario){
        const commentAGuardar ={
          owner: auth.currentUser.email,
          createdAt: Date.now(),
          description: comentario
      }
  
          db.collection('posts').doc(this.props.id).update({
              comments: firebase.firestore.FieldValue.arrayUnion(commentAGuardar)
          })
          .then(() => {
              this.setState({
                  comment: '',
                  commentsCount: this.state.commentsCount + 1
              });
          })
          .catch(err => console.log(err))
    }

    navegarComment(){
        this.props.navigation.navigate('Comments', {id: this.props.id, commentsData: this.props.data.comments, setCommentsCount: (num) => this.setCommentsCount(num)})
    }

  render() {    
    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.username} onPress={()=> this.userProfile()}>
                    <Text>{this.props.data.owner}</Text>
                </TouchableOpacity> 
                {
                    auth.currentUser.email === this.props.data.owner ?
                    <TouchableOpacity onPress={() => this.deletePost()}>
                        <Entypo name="cross" size={24} color="#5c0931" />
                    </TouchableOpacity> : 
                    <View></View>
                }
            </View>
                    
            <Image 
                style={styles.imagen}
                source={{uri:this.props.data.url}}
                resizeMode='cover'
                />
 
            <View style={styles.containerLikeCommDel}>
                {
                    this.state.myLike ? 
                    <TouchableOpacity style={styles.likes} onPress={() => this.dislike()}>
                        <Ionicons name="heart-sharp" size={24} color="#5c0931" />
                        <Text style={styles.likes.text}> {this.state.likesCount} </Text> 
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.likes} onPress={() => this.like()}>
                        <Ionicons name="heart-outline" size={24} color="#5c0931" />
                        <Text style={styles.likes.text}> {this.state.likesCount} </Text>
                    </TouchableOpacity>
                }

                        <TouchableOpacity style={styles.containerElem} onPress={() => this.navegarComment()}>
                            <FontAwesome name="comment-o" size={24} color="#5c0931" />
                            <Text>
                                {this.state.commentsCount}
                            </Text>
                        </TouchableOpacity>
                    </View>

            <TouchableOpacity style={styles.username} onPress={()=> this.userProfile()}>
                <Text style={styles.username.text}>{this.props.data.owner}</Text>
            </TouchableOpacity>
    
            <FlatList
                    style={styles.list}
                    data={this.state.comentarios}
                    keyExtractor={( item ) => item.createdAt.toString()}
                    renderItem={({item}) => <>
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {user: item.owner})}>
                                                    <Text style={styles.username}>{item.owner}</Text>
                                                </TouchableOpacity> <Text>{item.description}</Text>
                                            </>
                                }/>
            <View style={styles.commentsContainer}>
                <TouchableOpacity onPress={() => this.navegarComment()}>
                    <Text>Ver los {this.state.commentsCount} comentarios </Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.commentsInput}
                    keyboardType='default'
                    placeholder='Tu comentario!'
                    onChangeText={ text => this.setState({comment:text}) }
                    value={this.state.comment} 
                />

                <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
                    <Text> Subir </Text>
                </TouchableOpacity>
            </View>
        </View> 
    )
  }
}


const styles = StyleSheet.create({
    container:{
        marginVertical: 20,
        border: '1px solid #5c0931',
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    imagen:{
       height: 400,
       marginBottom: 20,
    },
    containerLikeCommDel:{
        marginBottom: 30,
        paddingHorizontal: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerElem:{
        width:'49%',
        justifyContent:'space-between',
        text:{
            paddingLeft: 4
        }
    },
    likes:{
        width:'49%',
        justifyContent:'space-between',
        textAlign: 'right',
        text:{
            paddingRight: 4
        }
    },
    username:{
        padding: 0,
        textAlign: 'center',
        text:{
            fontWeight: 'bold'
        }
    },
    list:{
        textAlign: 'center',
        marginTop:30
    },
    commentsContainer:{
        textAlign: 'center'
    },
    commentsInput:{
        textAlign: 'center'
    },
    containerDataPost:{  
        marginTop: 5,
    },
  })

export default Post

//TAREAS
// 2. ESTILOS