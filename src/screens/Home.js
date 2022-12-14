import React, { Component } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase/Config'
import Post from '../components/Post';

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
                <Text style={styles.pageTitle}>FNATIC</Text>
                {
                this.state.loader ? 
                    <ActivityIndicator style={styles.activity} size='large' color='#5c0931'/>  
                : 
                    <View style={styles.container}>
                        {this.state.allPosts.length === 0 ? 
                            <Text>There is nothing yet...</Text>
                        :
                            <FlatList  
                            data={this.state.allPosts}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({item}) => <Post navigation={this.props.navigation} id={item.id} data={item.data} url={item.url}/>} />
                        }
                    </View>
                }
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pageTitle: {
        color: 'white',
        fontSize: 40,
        padding: 15,
        backgroundColor: '#5c0931',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    activity: {
       marginTop: 250
    }
});

export default Home;