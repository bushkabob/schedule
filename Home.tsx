import { View, SafeAreaView, StyleSheet } from "react-native";
import { Agenda } from "react-native-calendars";
import { StatusBar } from 'expo-status-bar';

//get current date
const date = new Date().toDateString();

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.calendarView}>
                <Agenda selected={date} showClosingKnob />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarView: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
});

export default HomeScreen;

