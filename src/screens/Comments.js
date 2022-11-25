import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/Config';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';

class Comments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comentarios: [],
      comment: '',
      commentCount: props.route.params.commentsData.length
    }
  }

  componentDidMount() {
    db.collection('posts')
      .doc(this.props.route.params.id)
      .onSnapshot(doc => {
        this.setState({
          comentarios: doc.data().comments
        })
      })
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

  comment(comentario) {
    const commentAGuardar = {
      ownerUsername: this.state.userLoguedInfo[0]?.data.userName,
      ownerEmail: auth.currentUser.email,
      createdAt: Date.now(),
      description: comentario
    }

    db.collection('posts').doc(this.props.route.params.id).update({
      comments: firebase.firestore.FieldValue.arrayUnion(commentAGuardar)
    })
      .then(() => {
        this.setState({
          comment: '',
          commentCount: this.state.commentCount + 1
        });
      })
      .catch(err => console.log(err))
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          {this.state.commentCount == 0 ? 
              <Text>No comments yet...</Text>
            : <>
              <Text style={styles.cantComments}>
                {this.state.commentCount} 
              </Text>
              <FlatList
                    style={styles.flat}
                    data={this.state.comentarios.sort((a, b) => b.createdAt - a.createdAt)}
                    keyExtractor={( item ) => item.createdAt.toString()}
                    renderItem={({item}) => 
                                <>
                                    <View style={styles.comentarios}>
                                        <TouchableOpacity style={styles.comentarios.boxOwner} onPress={() => this.props.navigation.navigate('Go Back', {user: item.ownerEmail})}>
                                            <Text style={styles.comentarios.boxOwner.owner}>{item.ownerUsername}: </Text>
                                        </TouchableOpacity> 
                                        <Text style={styles.comentarios.texto}>{item.description}</Text>
                                    </View>
                                </>                  
                            }/> 
            </>
          }
          <View style={styles.containerComm}>
              <TextInput
                style={styles.commentsInput}
                keyboardType='default'
                placeholder='Your comment!'
                onChangeText={ text => this.setState({comment:text}) }
                value={this.state.comment} />
              <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
                <Text style={styles.boton}>
                  Up Load
                </Text>
              </TouchableOpacity>
          </View>


        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20
  },
  box:{
    textAlign: 'center',
    border: '1px solid #5c0931',
    width: '100%',
    backgroundColor: 'white'
  },
  cantComments:{
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 10,
    color: '#5c0931'
  },
  textButton: {
    fontSize: 10,
    color: 'whitesmoke',
    backgroundColor: '#5c0931',
    fontWeight: 'bold',
    width: '100%',
    padding: 3
  },
  cajacomentarios: {
    alignItems: 'flex-start',
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
              fontWeight: 550,
              fontSize: 15
          }
      },
      texto: {
          width: 'auto',
          textAlign: 'start',
          fontSize: 15
      }
  },
  containerComm: {
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  commentsInput: {
    backgroundColor: '#CCCCCC',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingLeft: 5,
    marginRight: 5,
    shadowOpacity: 20
  },
  boton: {
    backgroundColor: '#5c0931',
    color: 'white',
    borderRadius: 3,
    padding: 3,
    alignSelf: 'center',
    fontWeight: 'bold'
  }
})

export default Comments;

