import { Text, View, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { db } from '../firebase/Config'
import User from '../components/User'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: false,
            textSearch: '',
            users: [],
            filteredUsers: [],
            usersErr: '',
        }
    }

    componentDidMount() {
        db.collection('users').onSnapshot(
            docs => {
                let info = [];
                docs.forEach(doc => {
                    info.push({ id: doc.id, data: doc.data() })
                })
                this.setState({ users: info })
            }
        )
    }
    preventSubmit(event) {
        event.preventDefault()
        this.setState({ usersErr: '' });

        let textToFilter = this.state.textSearch.toLowerCase();

        if (this.state.textSearch === '') {
            this.setState({ requiredField: 'You cannot send an empty form' })
        } else {
            console.log(this.state.users)
            this.setState({ requiredField: '' })
            const filteredUsers = this.state.users?.filter((user) => user.data.userName?.toLowerCase().includes(textToFilter));
            console.log(filteredUsers)
            if (filteredUsers.length === 0) return this.setState({ usersErr: 'Sorry, that user does not exist', filteredUsers: [] })
            this.setState({ filteredUsers: filteredUsers })
        }
    }

    controlChanges(event) {
        this.setState({ textSearch: event.target.value })
    }


    render() {

        return (
            <View style={styles.padre}>
                <Text style={styles.title}>Search for anybody</Text>

                <TextInput style={styles.field}
                    keyboardType='default'
                    placeholder='Filters username or email '
                    onChangeText={text => this.setState({ textSearch: text })}
                    value={this.state.textSearch}
                    onChange={(event) => this.controlChanges(event)}
                />

                <TouchableOpacity onPress={(event) => this.preventSubmit(event)}>
                    <Text style={styles.button}>Search</Text>
                </TouchableOpacity>

                <Text style={styles.error}>{this.state.requiredField}</Text>


                <Text>{this.state.usersErr}</Text>

                <FlatList
             
                    data={this.state.filteredUsers}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <TouchableOpacity> <User style={styles.results} navigation={this.props.navigation} user={item.data} />  </TouchableOpacity>}
                />


            </View>

        )
    }
}
const styles = StyleSheet.create({
    padre: {
        textAlign: 'center',
        flex: 1
    },
    field: {
        marginTop: 7,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        color: '#535353',
        width: '90%',
        borderRadius: 5,
        height: '8%',
        paddingLeft: 10,
        shadowOpacity: 20,
        alignSelf: 'center'

    },
    title: {
        fontSize: 50,
        textShadowRadius: 10
    },
    button: {
        fontSize: 20,
        color: 'white',
        backgroundColor: '#5c0931',
        textDecorationStyle: 'bold',
        marginBottom: 10,
        marginTop: 3,
        padding: 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 7,
        shadowColor: 'black'
    },
    results: {
        fontSize: 35,
    },
    

})


export default Search