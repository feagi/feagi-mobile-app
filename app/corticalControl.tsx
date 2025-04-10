import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Switch,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

// Define a type for cortical areas from the API
type CorticalArea = {
  cortical_name: string;
  cortical_group: string;
  cortical_sub_group: string;
  visible: boolean;
  coordinates_2d: [number, number] | [null, null];
  coordinates_3d: [number, number, number];
  cortical_dimensions: [number, number, number];
  dev_count?: number;
  cortical_dimensions_per_device?: [number, number, number];
  async_key?: string;
};

// Define a type for control objects
type Control = {
  id: number;
  slideCount: number;
  type: "1D" | "2D" | "1DT";
  value?: number; // For 1D controls
  valueX?: number; // For 2D controls (X-axis)
  valueY?: number; // For 2D controls (Y-axis)
  corticalName?: string; // Store name from the api
  corticalId?: string; // Store the identifier (e.g. pwr)
};

const CorticalPage = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [isLandscape, setIsLandscape] = useState(width > height);
  const [controls, setControls] = useState<Control[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [api, setApi] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [availableCorticalAreas, setAvailableCorticalAreas] = useState<{
    [key: string]: CorticalArea;
  }>({});
  const [addedCorticalIds, setAddedCorticalIds] = useState<string[]>([]);
  const [mappedAreas, setMappedAreas] = useState({});
  const [deleteKey, setDeleteKey] = useState(0);
  //const [count, setCount] = useState(0);
  var count = 0;
  // Get dynamic modal styles based on orientation
  const getModalStyles = () => {
    if (isLandscape) {
      return {
        modalContent: {
          backgroundColor: "#2e2e2e",
          borderRadius: 20,
          width: "70%",
          maxHeight: "90%",
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
      };
    }
    return {
      modalContent: {
        backgroundColor: "#2e2e2e",
        borderRadius: 20,
        width: "90%",
        maxHeight: "80%",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    };
  };

  // Add a control based on cortical area data
  const addControl = async (deviceName, dimensions, corticalId) => {
    // Track this cortical area as added

    let prom = await TestFetch();

    for (let item of prom) {
      console.log("promised2" + item.toString());
      let trueKey = item[0].toString();
      console.log(trueKey);
      if (trueKey.substring(0, 8) === "cortical") {
        const newKey = await AsyncStorage.getItem(trueKey);
        const obj = JSON.parse(newKey);
        if (obj.key === corticalId) {
          await AsyncStorage.removeItem(trueKey);
          const availableAreas = await getAvailableAreas();
          setMappedAreas(availableAreas);
          //setDeleteKey(trueKey);
        }
      }
    }
    // I need to change this part
    /* var keyToDelete = "";
		AsyncStorage.getAllKeys((err, keys) => {
			AsyncStorage.multiGet(keys, (err, stores) => {
				stores.map((result, i, store) => {
					// get at each store's key/value so you can work with it
					let key = store[i][0];
					let value = store[i][1];
					if(key.substring(0,8)==="cortical"){
						const obj = JSON.parse(value);
						//console.log("looping " + key+ " " + value);
						if(obj.key === corticalId){
							setDeleteKey(key);
							//console.log("removing " + key);
						}

					}
				});
			});
		}); */

    if (dimensions[2] === 1) {
      // Toggle controls - x value determines number of toggles
      const newControl: Control = {
        id: Date.now() + Math.random(),
        slideCount: dimensions[0],
        corticalName: deviceName,
        corticalId: corticalId,
        type: "1DT",
        valueSwitch: Array(dimensions[0]).fill(false), // Array of toggle states
      };
      setControls((prev) => [...prev, newControl]);
    } else if (dimensions[2] > 1) {
      // Slider controls - x value determines number of sliders
      const newControl: Control = {
        id: Date.now() + Math.random(),
        slideCount: dimensions[0],
        corticalName: deviceName,
        corticalId: corticalId,
        type: "1D",
        valueSlider: Array(dimensions[0]).fill(50),
      };
      setControls((prev) => [...prev, newControl]);
    }
    //REMOVE FROM ASYNC STORAGE
    //await setMappedAreas(await getAvailableAreas());
    //console.log("deleting" + deleteKey);
  };

  // Send slider data to FEAGI
  const sendSliderData = async (control, index, value) => {
    if (!api || !control.corticalId) return;

    try {
      const endpoint = `${api}/v1/agent/sustained_stimulation`;

      // Create the payload according to the API documentation
      const payload = {
        stimulation_payload: {
          [control.corticalId]: [[index, 0, 0, value]],
        },
      };

      console.log("Sending slider data:", JSON.stringify(payload));

      // Send the POST request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Slider data sent:", response.status);
    } catch (error) {
      console.error("Error sending slider data:", error);
    }
  };

  // Send toggle data to FEAGI
  //not working
  const sendToggleData = async (control, index, isOn) => {
    if (!api || !control.corticalId) return;

    try {
      const endpoint = `${api}/v1/agent/sustained_stimulation`;

      console.log(endpoint);
      // Convert boolean to 0 or 100
      const value = isOn ? 100 : 0;

      // Create the payload according to the API documentation
      const payload = {
        stimulation_payload: {
          [control.corticalId]: [[index, 0, 0, value]],
        },
      };

      console.log("Sending toggle data:", JSON.stringify(payload));

      // Send the POST request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Toggle data sent:", response.status);
    } catch (error) {
      console.error("Error sending toggle data:", error);
    }
  };

  // Handle the activation button for toggles
  const activateControl = async (control, index = 0) => {
    if (!api || !control.corticalId) return;

    try {
      const endpoint = `${api}/v1/agent/manual_stimulation`;

      // Create the payload according to the API documentation
      const payload = {
        stimulation_payload: {
          [control.corticalId]: [[index, 0, 0]],
        },
      };

      console.log("Sending activation:", JSON.stringify(payload));

      // Send the POST request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const status = response.status;
      console.log("Activation sent:", response.status);

      // Handle the response body (could be null or string)
      const responseBody = await response.text();
      if (responseBody && responseBody !== "null") {
        console.log("Response data:", responseBody);
      }
    } catch (error) {
      console.error("Error sending activation:", error);
    }
  };

  // Effect for orientation change detection and API loading
  useEffect(() => {
    const updateOrientation = () => {
      const currentWidth = width;
      const currentHeight = height;
      setIsLandscape(currentWidth > currentHeight);
      console.log(
        `Orientation changed - Width: ${currentWidth}, Height: ${currentHeight}, Is Landscape: ${
          currentWidth > currentHeight
        }`
      );
    };

    // Set initial orientation
    updateOrientation();

    // Listen for orientation changes
    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      updateOrientation();
    });

    // Load API data
    const loadAPI = async () => {
      try {
        // This part is getting the keys
        const apiValue = await AsyncStorage.getItem("user");

        if (apiValue === null) {
          setIsLoading(false);
          return;
        } else {
          console.log("API value from storage:", apiValue);
          setApi(apiValue);
        }

        /*AsyncStorage.getAllKeys((err, keys) => {
                    if (err) {
                        console.log("Error getting keys:", err);
                        setIsLoading(false);
                        return;
                    }

                    if (!keys || keys.length === 0) {
                        console.log("No keys found in AsyncStorage");
                        setIsLoading(false);
                        return;
                    }

                    AsyncStorage.multiGet(keys, (err, stores) => {
                        if (err) {
                            console.log("Error getting values:", err);
                            setIsLoading(false);
                            return;
                        }

                        if (stores && stores.length > 0) {
							console.log(stores.length + ": length");
                            const apiValue = stores[0][1];
                            console.log("API value from storage:", apiValue);
                            setApi(apiValue);
                        } else {
                            console.log("No values found in AsyncStorage");
                            setIsLoading(false);
                        }
                    });
                });*/
      } catch (error) {
        console.log("Error in loadAPI:", error);
        setIsLoading(false);
      }
    };

    // Actually call the loadAPI function
    loadAPI();

    return () => {
      if (subscription) {
        ScreenOrientation.removeOrientationChangeListener(subscription);
      }
    };
  }, [width, height]);

  // Effect for loading cortical areas when API is available
  useEffect(() => {
    const loadControls = async () => {
      console.log("loadConts \n \n \n");
      // This is reading in the controls
      if (!api) {
        console.log("API not available yet");
        setIsLoading(false);
        return;
      }

      let apiVal = api + "/v1/cortical_area/cortical_area/geometry";
      console.log("API endpoint: " + apiVal);

      try {
        // It fetches the API here
        console.log("Fetching cortical areas...");
        const response = await fetch(apiVal);
        if (response.status !== 200) {
          // check if FEAGI session is expired and alert user
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const areasFromDb = await response.json();
        console.log("Received cortical areas data:");

        // Store all available cortical areas
        setAvailableCorticalAreas(areasFromDb);

        // Clear existing controls
        setControls([]);
        setAddedCorticalIds([]);

        // Here it's mapping the keys to the values found in the API
        //Object.keys(json).forEach(function (key) {

        //count(0);
        var theKey = await AsyncStorage.getAllKeys();
        console.log("keys are: " + theKey);

        //setCount(0);

        for (let key of Object.keys(areasFromDb)) {
          // Only auto-add areas with y=1
          if (areasFromDb[key].cortical_dimensions[1] === 1) {
            console.log("count = " + count);
            const deviceName = availableCorticalAreas[key]?.cortical_name;
            console.log("corticalName is " + deviceName);
            const dimensions = availableCorticalAreas[key]?.cortical_dimensions;

            // Add controls here

            // let stringVar = JSON.stringify({
            //   key: key,
            //   cortical_name: deviceName,
            //   cortical_dimensions: dimensions,
            // });
            //await AsyncStorage.setItem(("cortical"+count), stringVar);

            //const firstVal = await AsyncStorage.getItem("cortical0");
            // const testString =
            //   '{"key":"___pwr", "cortical_name":"Brain_Power", "cortical_dimensions":[1,1,1]}';

            let sample = JSON.stringify({
              key: key,
              cortical_name: deviceName,
              cortical_dimensions: dimensions,
            });
            let newSample = sample.toString();
            const keyVal = ("cortical" + count).toString();
            console.log(`keyvalue, newSample: ${keyVal}, ${newSample}`);

            await AsyncStorage.setItem(keyVal, newSample);

            console.log("sample is " + newSample);
            const objectToAdd = JSON.parse(newSample.toString());
            console.log("area: ", objectToAdd.key);
            //await addControl(objectToAdd.cortical_name, objectToAdd.cortical_dimensions, objectToAdd.key);
            setAddedCorticalIds((prev) => [...prev, objectToAdd.key]);
            console.log(
              "Look here Adding control for " +
                deviceName +
                " with dimensions " +
                dimensions
            );

            count++;

            //also add them to the async storage
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.log("Error loading cortical areas:", error);
        setIsLoading(false);
      }
    };

    const runBoth = async () => {
      if (!api) {
        console.log("API not available yet");
        setIsLoading(false);
        return;
      } else {
        await loadControls();
        const areas = await getAvailableAreas();
        setMappedAreas(areas);
      }
    };

    runBoth();
  }, [api]);

  useEffect(() => {
    const removeKey = async () => {
      if (deleteKey === 0) {
        return;
      } else {
        await AsyncStorage.removeItem(deleteKey.toString());
        const areas = await getAvailableAreas();
        setMappedAreas(areas);
      }
    };

    removeKey();
  }, [deleteKey]);

  const TestFetch = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys();
      let items = await AsyncStorage.multiGet(keys);
      return items;
    } catch (error) {
      throw new Error(
        "Error getting items from AsyncStorage: " + error.message
      );
    }
  };

  // Delete a control box
  const deleteControl = async (id: number) => {
    const controlToRemove = controls.find((c) => c.id === id);

    if (controlToRemove && controlToRemove.corticalId) {
      // Remove this control's corticalId from the added list
      setAddedCorticalIds((prev) =>
        prev.filter((cid) => cid !== controlToRemove.corticalId)
      );
    }

    setControls(controls.filter((control) => control.id !== id));

    console.log("control to Remove" + controlToRemove.corticalId);

    var key = controlToRemove.corticalId;
    console.log(availableCorticalAreas[controlToRemove.corticalId]);
    const deviceName = availableCorticalAreas[key].cortical_name;
    const dimensions = availableCorticalAreas[key].cortical_dimensions;
    let sample =
      '{"key":"' +
      key +
      '", "cortical_name":"' +
      deviceName +
      '","cortical_dimensions":[' +
      dimensions +
      "]}";
    let newSample = sample.toString();
    const keyVal = ("cortical" + count).toString();
    //console.log("adding " + newSample + " and: " + keyVal);

    await AsyncStorage.setItem(keyVal, newSample);
    setMappedAreas(await getAvailableAreas());
    //USEFULL
    let prom = await TestFetch();
    for (let item of prom) {
      console.log(item.toString());
      let trueKey = item[0].toString();
      console.log(trueKey);
      /*if(trueKey === controlToRemove.corticalId){
				console.log("removing" + trueKey);
			}*/
    }
    //console.log(prom.toString());

    //Add Cortical Controls to Async Storage
  };

  // Update slider value for 1D control
  const updateSlider1D = (id: number, value: number) => {
    const control = controls.find((c) => c.id === id);
    setControls(
      controls.map((control) =>
        control.id === id ? { ...control, value } : control
      )
    );

    if (control && control.corticalId) {
      sendSliderData(control, 0, value);
    }
  };

  // Update slider value for 2D control
  const updateSlider2D = (
    id: number,
    axis: "valueX" | "valueY",
    value: number
  ) => {
    const control = controls.find((c) => c.id === id);
    setControls(
      controls.map((control) =>
        control.id === id ? { ...control, [axis]: value } : control
      )
    );

    if (control && control.corticalId) {
      sendSliderData(control, axis === "valueX" ? 0 : 1, value);
    }
  };

  // Update switch state
  const updateSwitch = (id: number, toggle: boolean) => {
    const control = controls.find((c) => c.id === id);
    setControls(
      controls.map((control) =>
        control.id === id ? { ...control, switch: !toggle } : control
      )
    );

    if (control && control.corticalId) {
      sendToggleData(control, 0, 0, !toggle);
    }
  };

  // Get available areas for the modal
  const getAvailableAreas = async () => {
    const available = {};
    //look through ASYNC STORAGE. if there add it

    //WORK ON THIS PART TODO HERE

    let prom = await TestFetch();

    for (let item of prom) {
      // console.log("promised" + item.toString());
      let trueKey = item[0].toString();
      // console.log(trueKey);
      if (trueKey.substring(0, 8) === "cortical") {
        const newKey = await AsyncStorage.getItem(trueKey);
        const obj = JSON.parse(newKey);
        // console.log("uhh" + obj + " " + obj.key);
        available[obj.key] = availableCorticalAreas[obj.key];
      }
    }

    /*AsyncStorage.getAllKeys((err, keys) => {
			//console.log(keys);
			if(keys.length <= 1){
				console.log("not enough keyskeys");
				return available;
			}
			else{
				AsyncStorage.multiGet(keys, (err, stores) => {

					stores.map((result, i, store) => {
						// get at each store's key/value so you can work with it
		                let key = store[i][0];
		                let value = store[i][1];
		                if(key.substring(0,8)==="cortical"){
							console.log('key' + key);
							console.log("value" + value);
							const obj = JSON.parse(value);
							//await AsyncStorage.setItem(keyStr, obj);
							console.log("importatn key:",obj.key);
							//obj
							//console.log("ben look here" + JSON.stringify(availableCorticalAreas[obj.key]));

							available[obj.key] = availableCorticalAreas[obj.key];
							//console.log(available["___pwr"])
							//console.log(obj.cortical_name);
					    }
					});
				});
	        }
        });
	*/

    return available;
  };

  // Navigate back to godot page
  const goBack = () => {
    router.push("/GodotPage");
  };

  // Render a single control box
  const renderControl = (control: Control) => {
    return (
      <Swipeable
        key={`control-${control.id}`}
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
            {control.corticalName ||
              (control.type === "1D"
                ? "1D Cortical Area"
                : control.type === "2D"
                ? "2D Cortical Area"
                : "Switch Control")}
          </Text>

          {control.type === "1D" && control.valueSlider ? (
            // Render multiple sliders if needed
            control.valueSlider.map((value, index) => (
              <View key={`slider-${control.id}-${index}`}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={value}
                  onSlidingComplete={(newValue) => {
                    const newValues = [...control.valueSlider];
                    newValues[index] = newValue;
                    setControls(
                      controls.map((c) =>
                        c.id === control.id
                          ? { ...c, valueSlider: newValues }
                          : c
                      )
                    );
                    if (control.corticalId) {
                      sendSliderData(control, index, newValue);
                    }
                  }}
                  minimumTrackTintColor="#484a6e"
                  maximumTrackTintColor="#555"
                  thumbTintColor="#484a6e"
                />
              </View>
            ))
          ) : control.type === "1D" ? (
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={control.value}
              onSlidingComplete={(value) => updateSlider1D(control.id, value)}
              minimumTrackTintColor="#484a6e"
              maximumTrackTintColor="#555"
              thumbTintColor="#484a6e"
            />
          ) : control.type === "2D" ? (
            <>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={control.valueX}
                onSlidingComplete={(value) =>
                  updateSlider2D(control.id, "valueX", value)
                }
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
                onSlidingComplete={(value) =>
                  updateSlider2D(control.id, "valueY", value)
                }
                minimumTrackTintColor="#484a6e"
                maximumTrackTintColor="#555"
                thumbTintColor="#484a6e"
              />
            </>
          ) : control.type === "1DT" && control.valueSwitch ? (
            // Render multiple toggles if needed
            control.valueSwitch?.map((switchState, index) => (
              <View
                key={`toggle-${control.id}-${index}`}
                style={styles.switchView}
              >
                <Text style={styles.switchText}>{switchState ? "1" : "0"}</Text>
                <View style={styles.switch}>
                  <Switch
                    style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                    value={switchState}
                    onValueChange={() => {
                      const newSwitchValues = [...control.valueSwitch];
                      newSwitchValues[index] = !switchState;
                      setControls(
                        controls.map((c) =>
                          c.id === control.id
                            ? { ...c, valueSwitch: newSwitchValues }
                            : c
                        )
                      );
                      if (control.corticalId) {
                        sendToggleData(control, index, !switchState);
                      }
                    }}
                  />
                </View>
                {!switchState ? (
                  <TouchableOpacity
                    style={styles.activateButton}
                    onPress={() =>
                      control.corticalId && activateControl(control, index)
                    }
                  >
                    <Text style={styles.addButtonText}>Activate</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))
          ) : (
            // Single toggle
            <View style={styles.switchView}>
              <Text style={styles.switchText}>
                {control.switch === true ? "1" : "0"}
              </Text>

              <View style={styles.switch}>
                <Switch
                  style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                  value={control.switch}
                  onValueChange={(value) => updateSwitch(control.id, !value)}
                />
              </View>

              {control.switch === false ? (
                <TouchableOpacity
                  style={styles.activateButton}
                  onPress={() => control.corticalId && activateControl(control)}
                >
                  <Text style={styles.addButtonText}>Activate</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Cortical Controls</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        supportedOrientations={["portrait", "landscape"]}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <View style={[styles.modalContent, getModalStyles().modalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a Cortical Area</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={true}
            >
              {Object.keys(mappedAreas).length > 0 ? (
                Object.keys(mappedAreas).map((key) => (
                  <TouchableOpacity
                    key={`modal-item-${key}`}
                    style={styles.modalButton}
                    onPress={async () => {
                      //BEN TODO
                      //get add control
                      //console.log("key is " + key);
                      //console.log(JSON.stringify(mappedAreas));
                      //setMappedAreas([]);
                      setModalVisible(false);
                      setMappedAreas({});
                      await addControl(
                        availableCorticalAreas[key].cortical_name,
                        availableCorticalAreas[key].cortical_dimensions,
                        key
                      );
                      const areas = await getAvailableAreas();
                      setMappedAreas(areas);

                      //updateControls
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      {availableCorticalAreas[key]?.cortical_name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noAreasContainer}>
                  <Text style={styles.noAreasText}>
                    No additional cortical areas available
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#484a6e" />
          <Text style={styles.loadingText}>Loading cortical areas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {controls.map((control) => renderControl(control))}
        </ScrollView>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2e2e2e",
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#484a6e",
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  controlBox: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 60,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4444",
    width: 100,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#2e2e2e",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    width: "100%",
  },
  modalScrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalButton: {
    backgroundColor: "#484a6e",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  noAreasContainer: {
    padding: 20,
    alignItems: "center",
  },
  noAreasText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  switchView: {
    flexDirection: "row",
    marginTop: 2,
  },
  switchText: {
    textAlign: "left",
    margin: 5,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    position: "static",
  },
  switch: {
    alignContent: "center",
    marginLeft: 10,
  },
  activateButton: {
    marginLeft: "40%",
    textAlign: "center",
    backgroundColor: "black",
    borderRadius: 5,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
});

export default CorticalPage;
