import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: {};
  Settings: {};
  AddClass: {};
  AddAssignmentNavigator: {};
  EditAssignmentTypes: {};
};

export type HomeProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type SettingsProps = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type AddAssignmentNavigatorProps = NativeStackNavigationProp<RootStackParamList, "AddAssignmentNavigator">;
export type AddClassProps = NativeStackNavigationProp<RootStackParamList, 'AddClass'>;
export type EditAssignmentTypesProps = NativeStackNavigationProp<RootStackParamList, 'EditAssignmentTypes'>;