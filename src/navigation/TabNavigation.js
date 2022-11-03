import Home from '../screens/Home';
import Profile from '../screens/Profile';
import NewPost from '../screens/NewPost';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return(
        <Tab.Navigator screenOptions={ { tabBarShowLabel: false } }>
            <Tab.Screen name="Home" component={ Home } options={{tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />}}/>
            <Tab.Screen name="NewPost" component={ NewPost } options={{tabBarIcon: () => <Ionicons name="add-circle-outline" size={24} color="black" />}}/> 
            <Tab.Screen name="Profile" component={ Profile } options={{tabBarIcon: () => <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />, headerShown: false}}/>
        </Tab.Navigator>
    )
}

export default TabNavigation