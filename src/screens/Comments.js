import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { auth, db } from '../firebase/Config'
import firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';

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

  goBack(){
    this.props.route.params.setCommentsCount(this.state.commentCount);
    this.props.navigation.navigate('Home')
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>

          <TouchableOpacity stlye={styles.arrow} onPress={() => this.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#5c0931" />
          </TouchableOpacity>

          {this.state.commentCount == 0
            ? <Text>No comments yet</Text>
            : <>
              <Text style={styles.text}>
                {this.state.commentCount} Comments
              </Text>

              <FlatList
                data={this.state.comentarios}
                keyExtractor={(item) => item.createdAt.toString()}
                renderItem={({ item }) => <TouchableOpacity onPress={() => this.props.navigation.navigate('Go Back', {user: item.ownerEmail})}><Text>{item.ownerUsername}: {item.description}</Text></TouchableOpacity> }/>
                </>
              }
          
          <View style={styles.containerComm}>
            <TextInput
              style={styles.form}
              keyboardType='default'
              placeholder='Your comment!'
              onChangeText={text => this.setState({ comment: text })}
              value={this.state.comment} />
            <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
              <Text style={styles.textButton}>
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
    alignItems: 'center'
  },
  box: {
    border: '1px solid #5C0931',
    marginVertical: 30,
    width: '80%',
    backgroundColor: 'white',
    alignItems: 'center'
  },
  form: {
    width: '90%',
    border: '1px solid #5c0931',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10
  },
  textButton: {
    fontSize: 12,
    color: 'whitesmoke',
    backgroundColor: '#5c0931',
    fontWeight: 'bold',
    width: '100%',
    padding: 3
  },
  containerComm: {
    textAlign: 'center',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    marginVertical: 5,
    marginLeft: 8
  }
})

export default Comments

