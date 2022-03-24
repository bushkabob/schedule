import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: {};
  Settings: {};
  AddClass: {};
  AddAssingment: {};
  SelectListOption: { options: string[], selectOption: (option: string) => void, selected: string };
};

export type HomeProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type SettingsProps = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type AddAssingmentProps = NativeStackNavigationProp<RootStackParamList, 'AddAssingment'>;
export type AddClassProps = NativeStackNavigationProp<RootStackParamList, 'AddClass'>;
export type SelectScreenProps = NativeStackNavigationProp<RootStackParamList, 'SelectListOption'>;
export type SelectScreenRouteProps = RouteProp<RootStackParamList, 'SelectListOption'>;