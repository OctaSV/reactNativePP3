import Home from '../screens/Home';
import Profile from '../screens/Profile';
import NewPost from '../screens/NewPost';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return(
        <Tab.Navigator screenOptions={ { tabBarShowLabel: false, /*tabBarStyle: {flex :1, width: '5vw', height: '10vh', position: screenTop}, tabBarActiveTintColor: 'red'*/ tabBarInactiveTintColor: 'green'} }>
            <Tab.Screen name="Home" component={ Home } options={{tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />, headerShown: false, tabBarActiveTintColor: 'red', tabBarInactiveTintColor: 'green'}}/>
            <Tab.Screen name="NewPost" component={ NewPost } options={{tabBarIcon: () => <FontAwesome name="plus" size={24} color="black" />, headerShown: false}}/> 
            <Tab.Screen name="Profile" component={ Profile } options={{tabBarIcon: () => <FontAwesome name="user" size={24} color="black" />, headerShown: false}}/>
        </Tab.Navigator>
        //Agregar foto usuario
    )
}

export default TabNavigation