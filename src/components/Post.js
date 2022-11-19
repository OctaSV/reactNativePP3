import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../firebase/Config'
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { CurrentRenderContext } from '@react-navigation/native'

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
        console.log(this.props.data)
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
            <View style={styles.usercruz}>
                <TouchableOpacity style={styles.userNameBox} onPress={()=> this.userProfile()}>
                    <Text style={styles.userName} >{this.props.data.owner}</Text>
                </TouchableOpacity> 
                {
                    auth.currentUser.email === this.props.data.owner ?
                    <TouchableOpacity onPress={() => this.deletePost()}>
                        <Entypo name="cross" style={styles.cruz} size={50} color="#5c0931" />
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
                    <View style={styles.containerLikeCommDel}>
                    <TouchableOpacity style={styles.likes} onPress={() => this.dislike()}>
                        <Ionicons name="heart-sharp" size={30} color="#5c0931" /> 
                    </TouchableOpacity>
                    <Text style={styles.likes.text}> {this.state.likesCount} </Text> 
                    </View>
                    :
                    <View style={styles.containerLikeCommDel}>
                    <TouchableOpacity style={styles.likes} onPress={() => this.like()}>
                        <Ionicons name="heart-outline" size={30} color="#5c0931" /> 
                    </TouchableOpacity>
                    <Text style={styles.likes.text}> {this.state.likesCount} </Text>
                    </View>
                }
                        <View style={styles.containerLikeCommDel}>
                        <TouchableOpacity style={styles.likes} onPress={() => this.navegarComment()}>
                            <FontAwesome name="comment-o" size={30} color="#5c0931" />
                        </TouchableOpacity>
                        <Text style={styles.likes.text}> {this.state.commentsCount} </Text>
                        </View>
                    </View>

            <View style={styles.cajacomentarios}>
                <View>
                    <FlatList
                            style={styles.list}
                            data={this.state.comentarios}
                            keyExtractor={( item ) => item.createdAt.toString()}
                            renderItem={({item}) => <>
                                                        <View style={styles.comentarios}>
                                                        <TouchableOpacity style={styles.comentarios.boxOwner} onPress={() => this.props.navigation.navigate('Go Back', {user: item.owner})}>
                                                            <Text style={styles.comentarios.boxOwner.owner}>{item.owner}: </Text>
                                                        </TouchableOpacity> 
                                                        <Text style={styles.comentarios.texto}>{item.description}</Text>
                                                        </View>
                                                    </>
                                                    
                                        }/>
                                
                </View>
            </View>
            <View >
    

                <View style={styles.commentsContainer}>
                <TextInput
                    style={styles.commentsInput}
                    keyboardType='default'
                    placeholder='Leave a comment'
                    onChangeText={ text => this.setState({comment:text}) }
                    value={this.state.comment} 
                />

                <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
                    <Text style={styles.boton}> Comment </Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.navegarComment()}>
                    <Text style={styles.textoverloscomentarios}>{this.state.commentsCount} comments </Text>
                </TouchableOpacity>
            </View>
        </View> 
    )
  }
}


const styles = StyleSheet.create({
    container:{
        marginVertical: 20,
        borderWidth: 2,
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: '#5c0931',
        borderRadius: 5
    },
    imagen:{
       height: 400,
       marginBottom: 20,
    },
    containerLikeCommDel:{
        paddingHorizontal: 0,
        flexDirection: 'row',

    },
    containerElem:{
        width:'49%',
        text: {
            paddingLeft: 4
        }
    },
    likes:{
        width: '50%',
        textAlign: 'right',
        justifyContent: 'space-between',
        text: {
            size: 30,
            marginLeft: 2,
            alignSelf: 'center',
        }
    },
    userNameBox: {
        padding: 5
    },
    userName:{
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 650,
        padding: 5
    },
    list:{
        textAlign: 'center',
    },
    commentsContainer:{
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    containerDataPost:{  
        marginTop: 5,
    },
    boton: {
        backgroundColor: '#5c0931',
        color: 'white',
        borderRadius: 3,
        padding: 3,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    usercruz: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cajacomentarios: {
        borderWidth: 1,
        borderColor: '#5c0931',
        alignItems: 'flex-start',
        borderRadius: 2
    },
    comentarios: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        padding: 5,
        boxOwner: {
            width: 'auto',
            textAlign: 'start',
            owner: {
                fontWeight: 550
            }
        },
        texto: {
            width: 'auto',
            textAlign: 'start'
        }
       
    },
    commentsInput: {
        backgroundColor: '#CCCCCC',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        paddingLeft: 5,
        marginRight: 10,
        shadowOpacity: 20
    },
    textoverloscomentarios: {
        color: '#8b0000',
        textAlign: 'end'
    }

  })

export default Post

//TAREAS
// 2. ESTILOS