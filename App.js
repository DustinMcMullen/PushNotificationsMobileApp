import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, View, Platform } from 'react-native';

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
    async function configPushNotifications() {
      const {status} = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Push Notifications must be enabled to allow notifications."
        );
        return;
      }
      const pushTokenData = await Notifications.getExpoPushTokenAsync();

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT
        });
      }
    }

    configPushNotifications();

  }, []);

  useEffect(() => {
    const subscriptionRec = Notifications.addNotificationReceivedListener((notification) => {
      const userName = notification.request.content.data.userName;
    });

    const subscriptionRes = Notifications.addNotificationResponseReceivedListener((response) => {
    });

    // This return function is useEffect best practice
    // It will automatically execute for cleanup when useEffect is run again or parent component is removed.
    return () => {
      // .remove() is a method on the "subsbriction" promise returned by the listeners. It is used to cleanup event listener on removal of event. 
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

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[9ZM7ZUB4SCC1SX5k-Esyd3]",
        title: "Test sent from device",
        body: "This is a test push notification sent from mobile device."
      })
    })
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <Text>Hello World!!!!</Text>
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />
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
