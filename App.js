import { createBottomTabNavigator, createStackNavigator,} from 'react-navigation';
import tabBarIcon from './utils/tabBarIcon';
import FeedScreen from './screens/FeedScreen';
import NewPostScreen from './screens/NewPostScreen';
import SelectPhotoScreen from './screens/SelectPhotoScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import updateProfileScreen from './screens/updateProfileScreen';

const navigator = createBottomTabNavigator(
  {
	LoadingScreen: {
	  screen: LoadingScreen,
	  navigationOptions: {
		tabBarIcon: tabBarIcon('android'),
		title: '로그인',
		},
	  },
	
	Feed: {
	  screen: FeedScreen,
	  navigationOptions: {
		tabBarIcon: tabBarIcon('home'),
		title: '홈',
		},
	  },

	Photo: {
		screen: SelectPhotoScreen,
		navigationOptions: {
		  tabBarIcon: tabBarIcon('add-circle'),
		  title: '업로드',
		},
	  },

	Profile: {
		screen: ProfileScreen,
		navigationOptions: {
		  tabBarIcon: tabBarIcon('account-circle'),
		  title: '프로필',
		},
		},
  },
  {
	tabBarOptions: {
	  showLabel: true,
	  activeTintColor: 'black',
	  inactiveTintColor: 'gray',
	},
  },
);

const stackNavigator = createStackNavigator(
  {
	Main: {
		screen: navigator,
		navigationOptions: { title: '📸  인스타그램' },
	},
	NewPost: NewPostScreen,
	LoginScreen:LoginScreen,
	LoadingScreen:LoadingScreen,
	FeedScreen:FeedScreen,
	navigator:navigator,
	updateProfileScreen:updateProfileScreen,
	},
	
  {
	cardStyle: { backgroundColor: 'white' },
  },
);

export default stackNavigator;
