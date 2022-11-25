import Home from '../screens/Home';
import Profile from '../screens/Profile';
import NewPost from '../screens/NewPost';
import Search from '../screens/Search';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { storage } from '../firebase/Config';

const Tab = createBottomTabNavigator();

function TabNavigation() {
    return (
        <Tab.Navigator screenOptions={{ tabBarShowLabel: false,  tabBarInactiveTintColor: '#5c0931' }}>
            <Tab.Screen 
                name="Home"
                component={Home}
                options={{
                        tabBarIcon: () => <FontAwesome name="home" size={24} color="#5c0931" />,
                        headerShown: false
                    }}/>
            <Tab.Screen 
                name="Profile"
                component={Profile}
                options={{ 
                        tabBarIcon: () => <FontAwesome name="user" size={24} color="#5c0931" />,
                        headerShown: false 
                    }}/>
            <Tab.Screen
                name="NewPost" 
                component={NewPost} 
                options={{ 
                        tabBarIcon: () => <FontAwesome name="plus" size={24} color="#5c0931" />,
                        headerShown: false
                    }}/>
            <Tab.Screen
                name="Search" 
                component={Search} 
                options={{ 
                        tabBarIcon: () => <FontAwesome name='search' size={24} color="#5c0931" /> ,
                        headerShown: false 
                    }}/>
        </Tab.Navigator>
    )
};

export default TabNavigation;