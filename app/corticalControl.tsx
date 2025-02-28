import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Define a type for control objects
type Control = {
  id: number;
  type: '1D' | '2D';
  value?: number; // For 1D controls
  valueX?: number; // For 2D controls (X-axis)
  valueY?: number; // For 2D controls (Y-axis)
};

// Dummy data for initial control boxes
const initialControls: Control[] = [
  { id: 1, type: '1D', value: 50 },
  { id: 2, type: '2D', valueX: 50, valueY: 50 },
  { id: 3, type: '1D', value: 50 },
];

const CorticalPage = () => {
  const router = useRouter();
  const [controls, setControls] = useState<Control[]>(initialControls);

  // Add a new control box
  const addControl = () => {
    const newControl: Control = {
      id: Date.now(), // Unique ID for each control
      type: Math.random() > 0.5 ? '1D' : '2D', // Randomly assign 1D or 2D for now
      value: 50, // Default value for 1D
      valueX: 50, // Default value for 2D (X-axis)
      valueY: 50, // Default value for 2D (Y-axis)
    };
    setControls([...controls, newControl]);
  };

  // Delete a control box
  const deleteControl = (id: number) => {
    setControls(controls.filter((control) => control.id !== id));
  };

  // Update slider value for 1D control
  const updateSlider1D = (id: number, value: number) => {
    setControls(
      controls.map((control) =>
        control.id === id ? { ...control, value } : control
      )
    );
  };

  // Update slider value for 2D control
  const updateSlider2D = (id: number, axis: 'valueX' | 'valueY', value: number) => {
    setControls(
      controls.map((control) =>
        control.id === id ? { ...control, [axis]: value } : control
      )
    );
  };

  // Render a single control box
  const renderControl = (control: Control) => {
    return (
      <Swipeable
        key={control.id}
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteControl(control.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.controlBox}>
          <Text style={styles.controlTitle}>
            {control.type === '1D' ? '1D Cortical Area' : '2D Cortical Area'}
          </Text>
          {control.type === '1D' ? (
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={control.value}
              onValueChange={(value) => updateSlider1D(control.id, value)}
              minimumTrackTintColor="#484a6e"
              maximumTrackTintColor="#555"
              thumbTintColor="#484a6e"
            />
          ) : (
            <>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={control.valueX}
                onValueChange={(value) => updateSlider2D(control.id, 'valueX', value)}
                minimumTrackTintColor="#484a6e"
                maximumTrackTintColor="#555"
                thumbTintColor="#484a6e"
              />
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={control.valueY}
                onValueChange={(value) => updateSlider2D(control.id, 'valueY', value)}
                minimumTrackTintColor="#484a6e"
                maximumTrackTintColor="#555"
                thumbTintColor="#484a6e"
              />
            </>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cortical Controls</Text>
        <TouchableOpacity style={styles.addButton} onPress={addControl}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {controls.map((control) => renderControl(control))}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2e2e2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#484a6e',
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  controlBox: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    width: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CorticalPage;