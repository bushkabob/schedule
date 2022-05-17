import { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StoredAssignmentInfo } from './redux/assingmentsSlice';

export type RootStackParamList = {
  Home: {};
  Settings: {};
  AddClass: {};
  AddAssignmentNavigator: {};
  EditAssignmentTypes: {};
  AddAssignment: { assignment: StoredAssignmentInfo };
  SelectListOption: { options: string[], selected: string, updateSelected: (selectedValue: string) => void /*category: selectType*/ };
};

export type HomeProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type AddAssigmentProps = NativeStackNavigationProp<RootStackParamList, 'AddAssignment'>;
export type SettingsProps = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type AddAssignmentNavigatorProps = NativeStackNavigationProp<RootStackParamList, "AddAssignmentNavigator">;
export type AddClassProps = NativeStackNavigationProp<RootStackParamList, 'AddClass'>;
export type EditAssignmentTypesProps = NativeStackNavigationProp<RootStackParamList, 'EditAssignmentTypes'>;
export type SelectScreenRouteProps = RouteProp<RootStackParamList, 'SelectListOption'>;
export type AddAssignmentRouteProps = RouteProp<RootStackParamList, 'AddAssignment'>;