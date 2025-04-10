import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Global margin constants to be used throughout the app
const GLOBAL_MARGINS = {
    CONTAINER: 20,
    SECTION: 15,
    ELEMENT: 10,
    INNER: 5,
};

const InputSettingsPage = () => {
    const router = useRouter();

    // State for settings values
    const [isLoading, setIsLoading] = useState(true);
    const [api, setApi] = useState('');

    // Vision settings
    const [colorVision, setColorVision] = useState(null);
    const [centralResX, setCentralResX] = useState('');
    const [centralResY, setCentralResY] = useState('');
    const [peripheralResX, setPeripheralResX] = useState('');
    const [peripheralResY, setPeripheralResY] = useState('');
    const [flickerPeriod, setFlickerPeriod] = useState('');
    const [eccentricityX, setEccentricityX] = useState('');
    const [eccentricityY, setEccentricityY] = useState('');
    const [modulationX, setModulationX] = useState('');
    const [modulationY, setModulationY] = useState('');
    const [brightness, setBrightness] = useState('');
    const [contrast, setContrast] = useState('');
    const [shadows, setShadows] = useState('');
    const [pixelChangeThreshold, setPixelChangeThreshold] = useState('');

    // Go back to godotpage
    const goBack = () => {
        router.push('/godotpage');
    };

    // Load initial API URL
    useEffect(() => {
        const loadApi = async () => {
            try {
                const apiValue = await AsyncStorage.getItem("user");
                if (apiValue) {
                    console.log("API value from storage:", apiValue);
                    setApi(apiValue);
                } else {
                    console.log("No API value found");
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error loading API:", error);
                setIsLoading(false);
            }
        };

        loadApi();
    }, []);

    // Load settings when API is available
    useEffect(() => {
        if (api) {
            fetchSettings();
        }
    }, [api]);

    // Fetch settings from API
    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            console.log(`Fetching vision settings from: ${api}/v1/input/vision`);
            const response = await fetch(`${api}/v1/input/vision`);
            const statusCode = response.status;
            console.log(`Vision settings response status: ${statusCode}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`Vision settings data: ${JSON.stringify(data)}`);

                // Convert decimal values (0.0-1.0) to percentage (0-100) for UI display
                const convertDecimalToPercent = (value) => {
                    if (value === null || value === undefined) return '';
                    return Math.round(value * 100).toString();
                };

                // Update state with response data based on the actual API response format
                if (data) {
                    //color_vision (direct boolean value)
                    if (data.hasOwnProperty('color_vision')) {
                        setColorVision(data.color_vision);
                    }

                    // central_vision_resolution (array format [x, y])
                    if (data.central_vision_resolution && Array.isArray(data.central_vision_resolution) && data.central_vision_resolution.length >= 2) {
                        setCentralResX(data.central_vision_resolution[0]?.toString() || '');
                        setCentralResY(data.central_vision_resolution[1]?.toString() || '');
                    }

                    // peripheral_vision_resolution (array format [x, y])
                    if (data.peripheral_vision_resolution && Array.isArray(data.peripheral_vision_resolution) && data.peripheral_vision_resolution.length >= 2) {
                        setPeripheralResX(data.peripheral_vision_resolution[0]?.toString() || '');
                        setPeripheralResY(data.peripheral_vision_resolution[1]?.toString() || '');
                    }

                    // single value fields, safely checking for null
                    if (data.flicker_period !== null && data.hasOwnProperty('flicker_period')) {
                        setFlickerPeriod(data.flicker_period.toString());
                    } else {
                        setFlickerPeriod('10'); // Default value
                    }

                    // eccentricity (as decimal values that need to be converted to percentage)
                    if (data.eccentricity !== null && data.hasOwnProperty('eccentricity')) {
                        if (Array.isArray(data.eccentricity) && data.eccentricity.length >= 2) {
                            setEccentricityX(convertDecimalToPercent(data.eccentricity[0]));
                            setEccentricityY(convertDecimalToPercent(data.eccentricity[1]));
                        } else if (typeof data.eccentricity === 'number') {
                            // If it's a single value, convert and use it for both
                            const eccValue = convertDecimalToPercent(data.eccentricity);
                            setEccentricityX(eccValue);
                            setEccentricityY(eccValue);
                        }
                    } else {
                        setEccentricityX('15');
                        setEccentricityY('15');
                    }

                    // modulation (similar to eccentricity)
                    if (data.modulation !== null && data.hasOwnProperty('modulation')) {
                        if (Array.isArray(data.modulation) && data.modulation.length >= 2) {
                            setModulationX(convertDecimalToPercent(data.modulation[0]));
                            setModulationY(convertDecimalToPercent(data.modulation[1]));
                        } else if (typeof data.modulation === 'number') {
                            const modValue = convertDecimalToPercent(data.modulation);
                            setModulationX(modValue);
                            setModulationY(modValue);
                        }
                    } else {
                        setModulationX('85');
                        setModulationY('85');
                    }

                    // remaining scalar values that need percentage conversion
                    if (data.brightness !== null && data.hasOwnProperty('brightness')) {
                        setBrightness(convertDecimalToPercent(data.brightness));
                    } else {
                        setBrightness('10');
                    }

                    if (data.contrast !== null && data.hasOwnProperty('contrast')) {
                        setContrast(convertDecimalToPercent(data.contrast));
                    } else {
                        setContrast('40');
                    }

                    if (data.shadows !== null && data.hasOwnProperty('shadows')) {
                        setShadows(convertDecimalToPercent(data.shadows));
                    } else {
                        setShadows('25');
                    }

                    // pixel_change_limit (renamed from pixel_change_threshold in API)
                    if (data.pixel_change_limit !== null && data.hasOwnProperty('pixel_change_limit')) {
                        setPixelChangeThreshold(convertDecimalToPercent(data.pixel_change_limit));
                    } else {
                        setPixelChangeThreshold('100');
                    }
                }
            } else {
                const errorText = await response.text();
                console.error(`Error fetching vision settings: ${statusCode}`, errorText);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Validate input as integer
    const validateInt = (text) => {
        return text.replace(/[^0-9]/g, '');
    };

    // Apply changes
    const applyChanges = async () => {
        if (!api) {
            Alert.alert('Error', 'API connection not available');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Updating vision settings');

            // Convert percentage values from 0-100 to 0.0-1.0 range for the API
            const convertPercentToDecimal = (value) => {
                if (!value) return null;
                const numValue = parseInt(value);
                return numValue / 100;
            };

            //payload
            const payload = {
                color_vision: colorVision,
                central_vision_resolution: [
                    centralResX ? parseInt(centralResX) : null,
                    centralResY ? parseInt(centralResY) : null
                ],
                peripheral_vision_resolution: [
                    peripheralResX ? parseInt(peripheralResX) : null,
                    peripheralResY ? parseInt(peripheralResY) : null
                ],
                flicker_period: flickerPeriod ? parseInt(flickerPeriod) : null,
                // Convert percentage values to decimals (0.0-1.0)
                eccentricity: (eccentricityX && eccentricityY) ?
                    [convertPercentToDecimal(eccentricityX), convertPercentToDecimal(eccentricityY)] : null,
                modulation: (modulationX && modulationY) ?
                    [convertPercentToDecimal(modulationX), convertPercentToDecimal(modulationY)] : null,
                brightness: convertPercentToDecimal(brightness),
                contrast: convertPercentToDecimal(contrast),
                shadows: convertPercentToDecimal(shadows),
                pixel_change_limit: convertPercentToDecimal(pixelChangeThreshold)
            };

            console.log(`Sending POST to ${api}/v1/input/vision with payload:`, JSON.stringify(payload));

            const response = await fetch(`${api}/v1/input/vision`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const status = response.status;
            console.log(`Vision settings update status: ${status}`);

            let responseText = '';
            try {
                const responseData = await response.json();
                responseText = JSON.stringify(responseData);
                console.log(`Vision settings response data: ${responseText}`);
            } catch (e) {
                responseText = await response.text();
                console.log(`Vision settings response text: ${responseText}`);
            }

            if (response.ok) {
                console.log('Vision settings updated successfully');
                Alert.alert('Success', 'Settings updated successfully');
                goBack();
            } else {
                console.error(`Failed to update vision settings: ${status}`, responseText);
                Alert.alert('Error', `Failed to update settings: ${responseText}`);
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            Alert.alert('Error', `Failed to update settings: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Input Settings</Text>
                <TouchableOpacity onPress={goBack} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#81D4FA" />
                    <Text style={styles.loadingText}>Loading settings...</Text>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.sectionTitle}>Vision</Text>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Color vision</Text>
                            <Switch
                                value={colorVision}
                                onValueChange={setColorVision}
                                trackColor={{ false: '#767577', true: '#484a6e' }}
                                thumbColor={colorVision ? '#81D4FA' : '#f4f3f4'}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Central vision resolution X</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={centralResX}
                                onChangeText={text => setCentralResX(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Central vision resolution Y</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={centralResY}
                                onChangeText={text => setCentralResY(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Peripheral resolution X</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={peripheralResX}
                                onChangeText={text => setPeripheralResX(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Peripheral resolution Y</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={peripheralResY}
                                onChangeText={text => setPeripheralResY(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Flicker period (s)</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={flickerPeriod}
                                onChangeText={text => setFlickerPeriod(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Eccentricity X %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={eccentricityX}
                                onChangeText={text => setEccentricityX(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Eccentricity Y %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={eccentricityY}
                                onChangeText={text => setEccentricityY(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Modulation X %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={modulationX}
                                onChangeText={text => setModulationX(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Modulation Y %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={modulationY}
                                onChangeText={text => setModulationY(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Brightness %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={brightness}
                                onChangeText={text => setBrightness(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Contrasts %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={contrast}
                                onChangeText={text => setContrast(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Shadows %</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={shadows}
                                onChangeText={text => setShadows(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Pixel change threshold</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={pixelChangeThreshold}
                                onChangeText={text => setPixelChangeThreshold(validateInt(text))}
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={goBack}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.applyButton} onPress={applyChanges}>
                            <Text style={styles.buttonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A1A3A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: GLOBAL_MARGINS.CONTAINER,
        backgroundColor: '#0A1A3A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        padding: GLOBAL_MARGINS.INNER,
    },
    contentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: GLOBAL_MARGINS.CONTAINER,
        paddingBottom: GLOBAL_MARGINS.CONTAINER + GLOBAL_MARGINS.ELEMENT,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginBottom: GLOBAL_MARGINS.SECTION,
        paddingBottom: GLOBAL_MARGINS.INNER,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: GLOBAL_MARGINS.SECTION,
    },
    settingLabel: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    settingInput: {
        backgroundColor: '#fff',
        color: '#000',
        width: 80,
        height: 40,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: GLOBAL_MARGINS.CONTAINER,
    },
    cancelButton: {
        backgroundColor: '#81D4FA',
        padding: GLOBAL_MARGINS.SECTION,
        borderRadius: 10,
        flex: 1,
        marginRight: GLOBAL_MARGINS.ELEMENT,
        alignItems: 'center',
    },
    applyButton: {
        backgroundColor: '#81D4FA',
        padding: GLOBAL_MARGINS.SECTION,
        borderRadius: 10,
        flex: 1,
        marginLeft: GLOBAL_MARGINS.ELEMENT,
        alignItems: 'center',
    },
    buttonText: {
        color: '#0A1A3A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: GLOBAL_MARGINS.ELEMENT,
        fontSize: 16,
    },
});

export default InputSettingsPage;