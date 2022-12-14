import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, FlatList, TextInput } from 'react-native';
import { db, auth } from '../firebase/Config';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';
class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            likesCount: props.data.likes.length,
            commentsCount: props.data.comments.length,
            myLike: false,
            comentarios: [],
            comment: '',
            userInfo: [],
            userLoguedInfo: [],
            productDescription: ''
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
                    comentarios: doc?.data()?.comments,
                    productDescription: doc.data() !== undefined ? doc.data().post : false
                })
        })
        db.collection("users").where("email", '==', this.props.data.owner).onSnapshot((docs) => {
            let userInfo = [];
            docs.forEach((doc) => {
              userInfo.push({
                data: doc.data()
              })
            });
            this.setState({
              userInfo: userInfo,
            });
        });
        db.collection("users").where("email", '==', auth.currentUser.email).onSnapshot((docs) => {
            let userLoguedInfo = [];
            docs.forEach((doc) => {
              userLoguedInfo.push({
                data: doc.data()
              })
            });
            this.setState({
              userLoguedInfo: userLoguedInfo,
            });
        });
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
        if (confirm('Delete post') === true){
            db.collection('posts').doc(this.props.id).delete()
        } else {
            false
        }
    }

    setCommentsCount(num) {
        this.setState({
            commentsCount: num
        })
    }

    comment(comentario){
        if (comentario !== ''){
            const commentAGuardar = {
              ownerUsername: this.state.userLoguedInfo[0]?.data.userName,
              ownerEmail: auth.currentUser.email,
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
        } else{
            false
        }
    }

    navegarComment(){
        this.props.navigation.navigate('Comments', {id: this.props.id, commentsData: this.props.data.comments, setCommentsCount: (num) => this.setCommentsCount(num)})
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.usercruz}>
                    <TouchableOpacity style={styles.userNameBox} onPress={()=> this.userProfile()}>
                        <Image style={styles.profileImg} source={this.state.userInfo[0]?.data.photo ? {uri: this.state.userInfo[0]?.data.photo} : require('../../assets/logo.jpg')}/>
                        <Text style={styles.userName}>{this.state.userInfo[0]?.data.userName}</Text>
                    </TouchableOpacity>
                    {
                        auth.currentUser.email === this.props.data.owner ?
                            <TouchableOpacity onPress={() => this.deletePost()}>
                                <Entypo name="cross" style={styles.cruz} size={50} color="#5C0931" />
                            </TouchableOpacity>
                        :
                            false
                    }
                </View>
                {
                    this.state.myLike ?
                        <TouchableOpacity style={styles.imageBox}>
                            <Image
                            style={styles.img}
                            source={{uri:this.props.data.url}}
                            resizeMode='cover'
                            />
                        </TouchableOpacity>
                    :
                        <TouchableOpacity style={styles.imageBox} onPress={() => this.like()}>
                            <Image
                                style={styles.img}
                                source={{uri:this.props.data.url}}
                                resizeMode='cover'
                                />
                        </TouchableOpacity>
                }
                <View style={styles.containerLikeCommDel}>
                    {
                        this.state.myLike ?
                        <View style={styles.containerLikeCommDel}>
                        <TouchableOpacity style={styles.likes} onPress={() => this.dislike()}>
                            <Ionicons name="heart-sharp" size={30} color="#5C0931" />
                        </TouchableOpacity>
                        <Text style={styles.likes.text}> {this.state.likesCount} </Text>
                        </View>
                        :
                        <View style={styles.containerLikeCommDel}>
                        <TouchableOpacity style={styles.likes} onPress={() => this.like()}>
                            <Ionicons name="heart-outline" size={30} color="#5C0931" />
                        </TouchableOpacity>
                        <Text style={styles.likes.text}> {this.state.likesCount} </Text>
                        </View>
                    }
                    <View style={styles.containerLikeCommDel}>
                        <TouchableOpacity style={styles.likes} onPress={() => this.navegarComment()}>
                            <FontAwesome name="comment-o" size={25} color="#5C0931" />
                        </TouchableOpacity>
                        <Text style={styles.likes.text}> {this.state.commentsCount} </Text>
                    </View>
                </View>
                <View style={styles.productDescription}>
                    <Text style={styles.comments.boxOwner.owner}>{this.state.userInfo[0]?.data.userName}</Text>
                    <Text> {this.state.productDescription}</Text>
                </View>
                <View style={styles.boxComments}>
                    <View>
                        <FlatList
                                style={styles.list}
                                data={this.state.comentarios.sort((a, b) => b.createdAt - a.createdAt).slice(0,4)}
                                keyExtractor={( item ) => item.createdAt.toString()}
                                renderItem={({item}) =>
                                    <>
                                        <View style={styles.comments}>
                                            <TouchableOpacity style={styles.comments.boxOwner} onPress={() => this.props.navigation.navigate('Go Back', {user: item.ownerEmail})}>
                                                <Text style={styles.comments.boxOwner.owner}>{item.ownerUsername}: </Text>
                                            </TouchableOpacity>
                                            <Text style={styles.comments.text}>{item.description}</Text>
                                        </View>
                                    </>
                                }/>
                    </View>
                </View>
                <View style={styles.commentsContainer}>
                    <TextInput
                        style={styles.commentsInput}
                        keyboardType='default'
                        placeholder='Leave a comment'
                        onChangeText={ text => this.setState({comment:text}) }
                        value={this.state.comment}
                    />
                    <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
                        <Text style={styles.boton}>Comment</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.navegarComment()}>
                    <Text style={styles.seeComments}>{this.state.commentsCount} Comments </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginVertical: 20,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        backgroundColor: 'white',
        borderColor: '#5C0931'
    },
    imageBox: {
        height: 400
    },
    img:{
       height: 400,
       marginBottom: 20,
    },
    containerLikeCommDel:{
        paddingVertical: 3,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    userName:{
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 650,
        padding: 5
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 40
    },
    productDescription: {
        flexDirection: 'row',
        paddingLeft: 5.5,
        paddingVertical: 5
    },
    list:{
        textAlign: 'center',
    },
    commentsContainer:{
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingLeft: 5
    },
    containerDataPost:{
        marginTop: 5,
    },
    boton: {
        backgroundColor: '#5C0931',
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
    boxComments: {
        alignItems: 'flex-start',
    },
    comments: {
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
        text: {
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
    seeComments: {
        color: '#8B0000',
        textAlign: 'end',
        padding: 5
    }
});

export default Post;











