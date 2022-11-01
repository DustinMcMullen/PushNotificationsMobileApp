import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true
    }
  }
});

export default function App() {

  useEffect(() => {
    const subscriptionRec = Notifications.addNotificationReceivedListener((notification) => {
      const userName = notification.request.content.data.userName;
      console.log("userName: ", userName);
    });

    const subscriptionRes = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification Response: ", response);
    });

    // This return function is useEffect best practice
    // It will automatically execute for cleanup when useEffect is run again or parent component is removed.
    return () => {
      // .remove is a method on the "subsbriction" promise returned by the listeners. It is used to cleanup event listener on removal of event. 
      subscriptionRec.remove();
      subscriptionRes.remove();
    }
  }, []);

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Local Notification",
        body: "This is the body of the notification.",
        data: {userName: "Dustin"}
      },
      trigger: {
        seconds: 5
      }
    });
  }

  return (
    <View style={styles.container}>
    <Button
      title="Schedule Notification"
      onPress={scheduleNotificationHandler}
    />
      <Text>Hello World!!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
