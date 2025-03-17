import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Define a type for control objects
type Control = {
  id: number;
  type: '1D' | '2D' | '1DT';
  value?: number; // For 1D controls
  valueX?: number; // For 2D controls (X-axis)
  valueY?: number; // For 2D controls (Y-axis)
  switch?: boolean;
};

// Dummy data for initial control boxes
const initialControls: Control[] = [
  { id: 1, type: '1D', value: 50 },
  { id: 2, type: '2D', valueX: 50, valueY: 50 },
  { id: 3, type: '1DT', switch: false},
];

const CorticalPage = () => {
  const router = useRouter();
  const [controls, setControls] = useState<Control[]>(initialControls);
  const [modalVisible, setModalVisible] = useState(false);

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

  const addSwitch = () => {
    const newControl: Control = {
      id: Date.now(), // Unique ID for each control
      type: '1DT', // Randomly assign 1D or 2D for now
      switch: false
    };
    setControls([...controls, newControl]);
  }

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

  const updateSwitch = (id: number, toggle: boolean) => {
    setControls(
      controls.map((control) =>
        control.id === id ? { ...control, switch: !toggle } : control
      )
    );
  }

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
          {control.type === '1D' 
            ? '1D Cortical Area' 
            : control.type === '2D' 
            ? '2D Cortical Area' 
            : 'Switch Control'}
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
          ) : control.type === '2D' ? (
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
          ) : (
            <>
              <View style={styles.switchView}>
                <Text style={styles.switchText}>
                  {control.switch === true ? '1' : '0'}
                </Text>

                <View style={styles.switch}>
                  <Switch style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                    value={control.switch}
                    onValueChange={(value) => updateSwitch(control.id, !value)}
                  >
                  </Switch>
                </View>

                {control.switch == false ? (
                  <TouchableOpacity style={styles.activateButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>Activate</Text>
                  </TouchableOpacity>
                ) : (null)}

                
              </View>
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
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
      >
        <TouchableOpacity 
            style={styles.modalContainer}
            activeOpacity={1} 
            onPressOut={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add a Cortical Area</Text>
                  <ScrollView>

                    <TouchableOpacity style={styles.modalButton} onPress={() => {addControl(), setModalVisible(false)}}><Text>Servo Control</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => {addControl(), setModalVisible(false)}}><Text>Gyroscope</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => {addControl(), setModalVisible(false)}}><Text>1D Cortical Area</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => {addControl(), setModalVisible(false)}}><Text>2D Cortical Area</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={() => {addSwitch(), setModalVisible(false)}}><Text>Switch</Text></TouchableOpacity>
                  </ScrollView> 
                </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

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
    marginLeft: 10
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'blue',
    borderRadius: 20,
    width: '95%',
    height: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    padding: 10,
    marginTop: 10,
  },
  modalButton: {
    textAlign: 'center',
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '90%',
    
  },
  switchView: {
    flexDirection: 'row',
    marginTop: 2,
  },
  switchText: {
    textAlign: 'left',
    margin: 5,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'static'
  },
  switch: {
    alignContent: 'center',
    marginLeft: 10,
  },
  activateButton: {
    marginLeft: '40%',
    textAlign: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 5
  },
});

export default CorticalPage;