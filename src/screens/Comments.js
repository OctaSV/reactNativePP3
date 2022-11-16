import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { auth, db } from '../firebase/Config'
import firebase from 'firebase'
import { AntDesign } from '@expo/vector-icons';

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
      <View style={styles.container}>

        <TouchableOpacity onPress={() => this.volver()}>
          <AntDesign name="arrowleft" size={24} color="#5c0931" />
        </TouchableOpacity>

      {this.state.commentCount == 0 
      ? <Text>Aún no hay comentarios</Text> 
      : <>
          <Text style={styles.text}>
            {this.state.commentCount} comentarios
          </Text>

          <FlatList
                data={this.state.comentarios}
                keyExtractor={( item ) => item.createdAt.toString()}
                renderItem={({item}) => <Text>Comentario de {item.owner}: {item.description}</Text>} /> 
        </>
      }
      <View style={styles.containerComm}>
      <TextInput
          style={styles.form}
          keyboardType='default'
          placeholder='Tu comentario!'
          onChangeText={ text => this.setState({comment:text}) }
          value={this.state.comment} />

        <TouchableOpacity onPress={() => this.comment(this.state.comment)}>
          <Text style={styles.textButton}>
            Publicar
          </Text>
        </TouchableOpacity>
      </View>
        

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    marginBottom: '20px',
    marginTop: '20px',
    alignItems: 'center',
    border: '1px solid #5c0931',
    width: '80%',
    margin: 'auto',
    backgroundColor: 'white'
},
form:{
  border: '2px solid #5c0931',
  padding: '10px',
  width: '70%'
},
text:{
  fontSize: '20px',
  textAlign: 'center'
},
textButton:{
  fontSize: '12px',
  color: 'whitesmoke',
  backgroundColor: '#5c0931',
  fontWeight: 'bold',
  width: '100%',
  padding: '1px'
},
containerComm:{
  flex: 1,
  flexDirection: 'row',
  width: '400px',
  margin: '7px',
  justifyContent: 'center'
}
})

export default Comments

//TAREAS
// 1. ORDENAR LOS COMENTARIOS
// 2. ESTILOS