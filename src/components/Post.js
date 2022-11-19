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
                <TouchableOpacity  onPress={()=> this.userProfile()}>
                    <Text style={styles.username} >{this.props.data.owner}</Text>
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
                        <Ionicons name="heart-sharp" size={40} color="#5c0931" /> 
                    </TouchableOpacity>
                    <Text style={styles.likes.text}> {this.state.likesCount} </Text> 
                    </View>
                    :
                    <View style={styles.containerLikeCommDel}>
                    <TouchableOpacity style={styles.likes} onPress={() => this.like()}>
                        <Ionicons name="heart-outline" size={40} color="#5c0931" /> 
                    </TouchableOpacity>
                    <Text style={styles.likes.text}> {this.state.likesCount} </Text>
                    </View>
                }
                        <View style={styles.containerLikeCommDel}>
                        <TouchableOpacity style={styles.likes} onPress={() => this.navegarComment()}>
                            <FontAwesome name="comment-o" size={40} color="#5c0931" />
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
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Go Back', {user: item.owner})}>
                                                    <Text style={styles.comentarios.texto.owner}>{item.owner}: </Text>
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
                    placeholder='Deja un comentario'
                    onChangeText={ text => this.setState({comment:text}) }
                    value={this.state.comment} 
                />

                <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
                    <Text style={styles.boton}> Subir </Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.navegarComment()}>
                    <Text style={styles.textoverloscomentarios}>Ver los {this.state.commentsCount} comentarios </Text>
                </TouchableOpacity>
            </View>
        </View> 
    )
  }
}


const styles = StyleSheet.create({
    lik: {
        flexDirection: 'row',
        marginLeft: 5,
        fontSize: 10
    },
    container:{
        marginVertical: 20,
        borderWidth: 4,
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderColor: '#5c0931',
        borderRadius: 8
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
        width:'49%',
        textAlign: 'right',
        text: {
            size: 30,
            marginLeft: 11,
            alignSelf: 'center'
        }
    },
    username:{
        padding: 0,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 750,
    },
    list:{
        textAlign: 'center',
    },
    commentsContainer:{
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },

    containerDataPost:{  
        marginTop: 5,
    },
    cruz: {

    },
    boton: {
        fontSize: 15,
        backgroundColor: '#5c0931',
        color: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    usercruz: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cajacomentarios: {
        borderWidth: 2,
        borderColor: '#5c0931',
        alignItems: 'flex-start'
    },
    comentarios: {
        flexDirection: 'row',
        alignItems: 'center',
        texto: {
            fontSize: 18,
            owner: {
                fontWeight: 750
            }
        }
       
    },
    commentsInput: {
        backgroundColor: '#f5fffa',
        height: 15,
        width: '80vw',
        borderTopRightRadius: 7,
        marginTop: 3,
        marginRight: 3,
        marginBottom: 4,
        fontWeight: 300,
        
    },
    textoverloscomentarios: {
        marginTop: 6,
  fontWeight: 600,
  color: '#8b0000'
    }

  })

export default Post

//TAREAS
// 2. ESTILOS