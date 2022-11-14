import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { auth, db } from '../firebase/Config'
import firebase from 'firebase'

class Search extends Component {
    constructor(props){
        super(props)
        this.state={
            search: false,
            textSearch: '',
            users:[],
            filteredUsers: [],
            usersErr: ''
        }
    }

    componentDidMount () {
        db.collection('users').onSnapshot(
            docs => {
                let info = [];
                docs.forEach(doc => {
                    info.push({id: doc.id, data: doc.data()})
                })
                this.setState({users: info})
            }
        )
    }
    preventSubmit(event){
        event.preventDefault()
        this.setState({ usersErr: ''});
        let textToFilter = this.state.textSearch.toLowerCase();
        if (this.state.textSearch === '') {
            this.setState({requiredField: 'You cannot send an empty form'})
        } else {
            console.log(this.state.users)
            this.setState({requiredField: ''})
            const filteredUsers = this.state.users?.filter((user) => user.data.userName.toLowerCase().includes(textToFilter));
            console.log(filteredUsers)
            if (filteredUsers.length === 0) return this.setState({ usersErr: 'Sorry, that user does not exist', filteredUsers: []})
            this.setState({ filteredUsers: filteredUsers})
        }
    }

    controlChanges(event){
        this.setState({textSearch: event.target.value})
    }

    clear() {
        this.setState({
            dataSearchResults: [],
            search: false,
            textSearch: '',
        })
    };
  




  render() {
    return (
   <View>
            <Text style={styles.title}>Search for anyone</Text>
            <TextInput style={styles.field}
                 keyboardType='default'
                placeholder='   Search '
                onChangeText={ text => this.setState({textSearch:text}) }
                value={this.state.textSearch}
                onChange={(event) => this.controlChanges(event)}
            />
            <TouchableOpacity onPress={(event) => this.preventSubmit(event)}>
                <Text  style={styles.button}>Send</Text>
            </TouchableOpacity>
            <Text style={styles.error}>{this.state.requiredField}</Text>
            <TouchableOpacity onPress={() => this.clear()}>
                <Text  style={styles.button}>Clear search</Text>
            </TouchableOpacity>
            <Text>{this.state.usersErr}</Text>
            <FlatList
                    data={this.state.filteredUsers}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Text>{item.data.username}</Text> }
                />
        </View>

    )
  }
}
const styles = StyleSheet.create({
    field: {
       backgroundColor: 'red'
  
    },
    title: {
   
    },
    button:{
    
    },
    text: {
     
    },
    error: {
   
    },
})


export default Search