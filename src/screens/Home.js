import React, { Component } from 'react';
import Post from '../components/Post';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/Config'

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            allPosts: [],
            loader: true
        }
    }

    componentDidMount(){
        db.collection('posts').orderBy('createdAt', 'desc')
        .onSnapshot(docs => {
            let posts = [];
            docs.forEach(doc => {
                posts.push({
                id: doc.id,
                data: doc.data()
                })
            })

            this.setState({
                allPosts: posts,
                loader: false
            })
        })
    }

    logOut(){
        auth.signOut()
    }
    
    render() {
        return (
            <React.Fragment>
                {
                this.state.loader ? 
                    <ActivityIndicator size='large' color='#5c0931'/>  
                : 
                    <View style={styles.container}>
                        <Text style={styles.pageTitle}>FNATIC</Text>
                        {this.state.allPosts.length === 0 ? 
                            <Text>Aun no hay posteos </Text>
                        :
                            <FlatList 
                            style={styles.flatlist}    
                            data={this.state.allPosts}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({item}) => <Post style={styles.flatlist}navigation={this.props.navigation} id={item.id} data={item.data} url={item.url}/>} />
                        }
                    </View>
                }
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100vh',
        width: '100vw'
    },
    pageTitle: {
        color: 'white',
        fontSize: 40,
        padding: 15,
        backgroundColor: '#5c0931'
    },
    flatlist: {
        margin: 'auto',
        width: '100%'
    }
})

export default Home;