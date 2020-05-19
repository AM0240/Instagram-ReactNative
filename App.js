// 리액트 네비게이션 import
import { createBottomTabNavigator, createStackNavigator,} from 'react-navigation';
import tabBarIcon from './utils/tabBarIcon';

// 스크린 import
import FeedScreen from './screens/FeedScreen';
import NewPostScreen from './screens/NewPostScreen';
import SelectPhotoScreen from './screens/SelectPhotoScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import updateProfileScreen from './screens/updateProfileScreen';

// 하단 네비게이션을 이용해 이동할 스크린 설정
const navigator = createBottomTabNavigator(
  {
	// 스크린이름: { 스크린, 네비게이션 아이콘, 이름 }


	// 구글 로그인 테스트용
	LoadingScreen: {
	  screen: LoadingScreen,
	  navigationOptions: {
		tabBarIcon: tabBarIcon('android'),
		title: '로그인',
		},
	  },
	
	// 메인 스크린
	Feed: {
	  screen: FeedScreen,
	  navigationOptions: {
		// vector icon 사용
		tabBarIcon: tabBarIcon('home'),
		title: '홈',
		},
	  },

	// 업로드 스크린
	Photo: {
		screen: SelectPhotoScreen,
		navigationOptions: {
		  tabBarIcon: tabBarIcon('add-circle'),
		  title: '업로드',
		},
	  },

	// 프로필 스크린
	Profile: {
		screen: ProfileScreen,
		navigationOptions: {
		  tabBarIcon: tabBarIcon('account-circle'),
		  title: '프로필',
		},
		},
  },
  {
	// 활성화 된 탭은 검정색, 비활성화 된 탭은 회색, title을 표시
	tabBarOptions: {
	  showLabel: true,
	  activeTintColor: 'black',
	  inactiveTintColor: 'gray',
	},
  },
);

// stackNavaigator에 navigator를 메인스크린으로하고 나머지는 하단에는 안보이지만 특정 이벤트 시 로드할 스크린 등록
const stackNavigator = createStackNavigator(
  {
	Main: {
		screen: navigator,
	  // 탭 표시줄 화면이 있을 때 앱 제목 설정
		navigationOptions: { title: '📸  과기스타그램' },
	},
	// 이 스크린은 탭 표시줄이 없음
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
