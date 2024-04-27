import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
} from "react-native";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import * as Permissions from "react-native-permissions";
import moment from "moment"; // Import moment.js library

export default function App() {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [displayData, setDisplayData] = useState(null);

  const handleSubmit = async () => {
    const formattedDate = moment(date, "DD-MM-YYYY").toISOString(); // Format date using moment.js
    const eventConfig = {
      title,
      startDate: formattedDate,
      endDate: moment(formattedDate).endOf("day").toISOString(), // Set end date to the end of the day
      allDay: true,
    };

    try {
      const permission = await Permissions.request(
        Platform.select({
          ios: Permissions.PERMISSIONS.IOS.CALENDARS_WRITE_ONLY,
          android: Permissions.PERMISSIONS.ANDROID.WRITE_CALENDAR,
        })
      );

      if (permission !== Permissions.RESULTS.GRANTED) {
        console.warn("No permission to access calendar");
        return;
      }

      const eventInfo = await AddCalendarEvent.presentEventCreatingDialog(
        eventConfig
      );
      if (eventInfo.action === "SAVED") {
        const data = { date, title };
        setDisplayData(data);
      } else if (eventInfo.action === "CANCELED") {
        console.warn("Event creation was canceled");
      }
    } catch (error) {
      console.warn("Error creating event", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Date (DD-MM-YYYY)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Submit" onPress={handleSubmit} />
      {displayData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Date: {displayData.date}</Text>
          <Text style={styles.dataText}>Title: {displayData.title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  dataText: {
    fontSize: 16,
  },
});
