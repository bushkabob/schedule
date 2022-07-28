import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectType } from './AddAssingment';

export type RootStackParamList = {
  AddAssignment: { selectedData?: {category: string, selectedString: string} /*selectedOption: { title: string, category: selectType } | undefined*/ };
  SelectListOption: { name: string, options: string[], selected: string /*category: selectType*/ };
};

export type AddAssignmentProps = NativeStackNavigationProp<RootStackParamList, 'AddAssignment'>;
export type SelectScreenProps = NativeStackNavigationProp<RootStackParamList, 'SelectListOption'>;
export type AddAssignmentRouteProps = RouteProp<RootStackParamList, 'AddAssignment'>;
export type SelectScreenRouteProps = RouteProp<RootStackParamList, 'SelectListOption'>;