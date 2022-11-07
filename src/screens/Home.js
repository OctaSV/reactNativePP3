import Post from '../components/Post';

import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import React, { Component } from 'react';
import { db } from '../firebase/Config'

class Home extends Component {
    constructor(){
        super();
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
    
    render() {
        return (
        <View style={styles.flatlist}>

        {
        this.state.loader 
            ? <ActivityIndicator size='large' color='black'/>  
            : this.state.allPosts.length === 0 
                ? <Text>Aun no hay posteos </Text> 
                : <FlatList 
                    style={styles.flatlist}    
                    data={this.state.allPosts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => <Post navigation={this.props.navigation} id={item.id} data={item.data} url={item.url}/>} />
        }

        </View>
        )
    }
    }

const styles = StyleSheet.create({
    flatlist: {
        flex: 1
    }
})

export default Home