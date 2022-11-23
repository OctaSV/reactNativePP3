import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/Config';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase';

class Comments extends Component {
    constructor(props){
        super(props)
        this.state={
            comentarios: [],
            comment:'',
            commentCount: props.route.params.commentsData.length
        }
    }

    componentDidMount(){
      db.collection('posts')
            .doc(this.props.route.params.id)
            .onSnapshot(doc => {
                this.setState({
                    comentarios:doc.data().comments
                })
            })
    }

    comment(comentario){
      const commentAGuardar ={
        owner: auth.currentUser.email,
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
    console.log(this.state.comentarios)
    return (
      <View style={styles.container}>
        <View style={styles.box}>
            <TouchableOpacity stlye={styles.arrow} onPress={() => this.goBack()}>
              <AntDesign name="arrowleft" size={24} color="#5c0931" />
            </TouchableOpacity>
          {this.state.commentCount == 0 ? 
            <Text>No comments yet</Text> 
          : <>
              <Text style={styles.text}>
                {this.state.commentCount} Comments
              </Text>

              <FlatList
                    data={this.state.comentarios}
                    keyExtractor={( item ) => item.createdAt.toString()}
                    renderItem={({item}) => <Text>{item.owner}: {item.description}</Text>} /> 
            </>
          }
          <View style={styles.containerComm}>
              <TextInput
                style={styles.form}
                keyboardType='default'
                placeholder='Your comment!'
                onChangeText={ text => this.setState({comment:text}) }
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
  box:{
    textAlign: 'center',
    border: '1px solid #5c0931',
    width: '80%',
    backgroundColor: 'white'
  },
  form:{
    width: '90%',
    border: '1px solid #5c0931'
  },
  text:{
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10
  },
  textButton:{
    fontSize: 12,
    color: 'whitesmoke',
    backgroundColor: '#5c0931',
    fontWeight: 'bold',
    width: '100%',
    padding: 3
  },
  containerComm:{
    textAlign: 'center',
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'center',
    marginVertical: 5,
    marginLeft: 8
  }
});

export default Comments;