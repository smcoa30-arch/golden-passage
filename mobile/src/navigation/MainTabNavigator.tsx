import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { TradesScreen } from '../screens/trades/TradesScreen';
import { JournalScreen } from '../screens/journal/JournalScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { MoreScreen } from '../screens/more/MoreScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  Trades: undefined;
  Journal: undefined;
  Analytics: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
              break;
            case 'Trades':
              iconName = focused ? 'chart-line' : 'chart-line';
              break;
            case 'Journal':
              iconName = focused ? 'book-open' : 'book-open-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'chart-pie' : 'chart-pie-outline';
              break;
            case 'More':
              iconName = focused ? 'menu' : 'menu';
              break;
            default:
              iconName = 'help-circle';
          }

          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Trades" 
        component={TradesScreen}
        options={{ title: 'Trades' }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{ title: 'Journal' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
};
