import Login from '../screens/Login';
import Register from '../screens/Register';
import TabNavigation from './TabNavigation';
import Comments from '../screens/Comments';
import Profile from '../screens/Profile';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppMainWindow() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={ { headerShown: false } }/>
            <Stack.Screen name="Register" component={Register} options={ { headerShown: false } }/>
            <Stack.Screen name="TabNavigation" component={TabNavigation} options={ { headerShown: false } }/>
            <Stack.Screen name="Comments" component={Comments} />
            <Stack.Screen name="Go Back" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    )
};

export default AppMainWindow;