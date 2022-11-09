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
            this.state.loader ? 
                    <ActivityIndicator size='large' color='black'/>  
                :
                    <>
                        <View>
                            <Text style={styles.title}>FANATIC</Text>
                            <TouchableOpacity onPress={ ()=> this.logOut()}>
                                <Text>Log out</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.allPosts.length === 0 ? 
                                    <Text>Aun no hay posteos </Text> 
                                : 
                                    <FlatList data={this.state.allPosts}
                                        keyExtractor={item => item.id.toString()}
                                        renderItem={({item}) => <Post navigation={this.props.navigation} id={item.id} data={item.data} url={item.url}/>} />
                        }
                    </>
        )
    }
}

const styles = StyleSheet.create({title: {fontSize: 20}})

export default Home;