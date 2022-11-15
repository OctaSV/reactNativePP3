import Home from '../screens/Home';
import Profile from '../screens/Profile';
import NewPost from '../screens/NewPost';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../firebase/Config'
import { Component } from 'react';

const Tab = createBottomTabNavigator();

class TabNavigation extends Component {
    constructor(props){
        super(props)
        this.state = {user:{}}
    }

    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user
                })
            }
        })
    }

    userProfile(){
        this.props.navigation.navigate('Profile', {user: this.state.user.email})
    }

    render(){
        console.log(auth)
        return (
            <Tab.Navigator screenOptions={ { tabBarShowLabel: false, /*tabBarStyle: {flex :1, width: '5vw', height: '10vh', position: screenTop}, tabBarActiveTintColor: 'red'*/ tabBarInactiveTintColor: 'green'} }>
                <Tab.Screen name="Home" component={ Home } listeners={{tabPress: () => this.userProfile()}} options={{tabBarIcon: () => <FontAwesome name="home" size={24} color="#5c0931" />, headerShown: false, tabBarActiveTintColor: 'red', tabBarInactiveTintColor: 'green'}}/>
                <Tab.Screen name="NewPost" component={ NewPost } options={{tabBarIcon: () => <FontAwesome name="plus" size={24} color="#5c0931" />, headerShown: false}}/> 
                <Tab.Screen name="Profile" component={ Profile } listeners={{tabPress: () => this.userProfile()}} options={{tabBarIcon: () => <FontAwesome name="user" size={24} color="#5c0931" />, headerShown: false}}/>
            </Tab.Navigator>
        //Agregar foto usuario
        )
    }
}

export default TabNavigation