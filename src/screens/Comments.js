import { Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import { auth, db } from '../firebase/Config'
import firebase from 'firebase'

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

    volver(){
      this.props.route.params.setCommentsCount(this.state.commentCount);
      this.props.navigation.navigate('Home')
    }

  render() {
    return (
      <View>

        <TouchableOpacity onPress={() => this.volver()}>
          <Text>
            Volver
          </Text>
        </TouchableOpacity>

      {this.state.commentCount == 0 
      ? <Text>Aún no hay comentarios</Text> 
      : <>
          <Text>
            {this.state.commentCount} comentarios
          </Text>

          <FlatList
                data={this.state.comentarios}
                keyExtractor={( item ) => item.createdAt.toString()}
                renderItem={({item}) => <Text>Comentario de {item.owner}: {item.description}</Text>} /> 
        </>
      }

        <TextInput
          keyboardType='default'
          placeholder='Tu comentario!'
          onChangeText={ text => this.setState({comment:text}) }
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

export default Comments

//TAREAS
// 1. ORDENAR LOS COMENTARIOS
// 2. ESTILOS