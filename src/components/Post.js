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

    comment(comentario) {
        const commentAGuardar = {
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

    navegarComment() {
        this.props.navigation.navigate('Comments', { id: this.props.id, commentsData: this.props.data.comments, setCommentsCount: (num) => this.setCommentsCount(num) })
    }

    render() {

        console.log(this.props.navigation)
        return (
            <View style={styles.container}>
                <View style={styles.dataTop}>
                    <TouchableOpacity style={styles.username} onPress={() => this.userProfile()}><Text>{this.props.data.owner}</Text></TouchableOpacity>
                    {
                        auth.currentUser.email === this.props.data.owner
                            ? <TouchableOpacity style={styles.containerElemD} onPress={() => this.deletePost()}>
                                <Entypo name="cross" size={24} color="#5c0931" />
                            </TouchableOpacity>

                            : <View></View>
                    }

                </View>

                <Image style={styles.imagen} source={this.props.data.url} />

                <View style={styles.containerDataPost}>
                    <View style={styles.containerLikeCommDel}>
                        {
                            this.state.myLike
                                ?
                                <View style={styles.containerElem}>
                                    <TouchableOpacity style={styles.containerElem} onPress={() => this.dislike()}>
                                        <Ionicons name="heart-sharp" size={24} color="#5c0931" />
                                        <Text>
                                            {this.state.likesCount}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.containerElem}>
                                    <TouchableOpacity style={styles.containerElem} onPress={() => this.like()}>
                                        <Ionicons name="heart-outline" size={24} color="#5c0931" />
                                        <Text>
                                            {this.state.likesCount}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                        }

                        <TouchableOpacity style={styles.containerElem} onPress={() => this.navegarComment()}>
                            <FontAwesome name="comment-o" size={24} color="#5c0931" />
                            <Text>
                                {this.state.commentsCount}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <Text style={styles.text}>
                    <TouchableOpacity style={styles.username} onPress={() => this.userProfile()}><Text>{this.props.data.owner} </Text></TouchableOpacity>{this.props.data.post}
                </Text>

                <FlatList
                    style={styles.comments}
                    data={this.state.comentarios}
                    keyExtractor={(item) => item.createdAt.toString()}
                    renderItem={({ item }) => <><TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { user: item.owner })}><Text style={styles.username}>{item.owner}</Text></TouchableOpacity> <Text>{item.description}</Text></>} />

                <TouchableOpacity onPress={() => this.navegarComment()}>
                    <Text>
                        Ver los {this.state.commentsCount} comentarios
                    </Text>
                </TouchableOpacity>

                <TextInput
                    keyboardType='default'
                    placeholder='Tu comentario!'
                    onChangeText={text => this.setState({ comment: text })}
                    value={this.state.comment} />

                <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
                    <Text>
                        Subir
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    imagen:{
       height: 400,
       width: 400,
       marginBottom: 20,
       marginTop: 0 
    },
    text: {
        flex: 1,
        fontSize: 15,
        marginBottom: 20
    },
    container:{
        marginBottom: 20,
        marginTop: 20,
        alignItems: 'center',
        border: '1px solid #5c0931',
        width: 400,
        margin: 'auto',
        backgroundColor: 'white',

    },
    containerElem:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerElemD:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    containerLikeCommDel:{
        flex: 1,
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'flex-start',
    },
    containerDataPost:{
        width: 100,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',

    },
    dataTop:{
        flex: 1,
        width: 400,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    username:{
        padding: 0,
        fontWeight: 'bold'
    },
    comments:{
        marginBottom: 20
    }
  })

export default Post

//TAREAS
// 2. ESTILOS