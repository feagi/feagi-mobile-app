import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BrainSettingsPage = () => {
    const router = useRouter();

    // State for settings values
    const [refreshRate, setRefreshRate] = useState('');
    const [plasticityQueue, setPlasticityQueue] = useState('');
    const [samplingRate, setSamplingRate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [api, setApi] = useState('');

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
            // Fetch refresh rate
            console.log(`Fetching refresh rate from: ${api}/v1/burst_engine/stimulation_period`);
            const refreshResponse = await fetch(`${api}/v1/burst_engine/stimulation_period`);
            const refreshStatusCode = refreshResponse.status;
            console.log(`Refresh rate response status: ${refreshStatusCode}`);

            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                console.log(`Refresh rate data: ${JSON.stringify(refreshData)}`);
                setRefreshRate(refreshData.toString());
            } else {
                const errorText = await refreshResponse.text();
                console.error(`Error fetching refresh rate: ${refreshStatusCode}`, errorText);
            }

            // Fetch plasticity queue depth - using query parameter approach
            const plasticityUrl = `${api}/v1/neuroplasticity/plasticity_queue_depth`;
            console.log(`Fetching plasticity queue from: ${plasticityUrl}`);
            const plasticityResponse = await fetch(plasticityUrl);
            const plasticityStatusCode = plasticityResponse.status;
            console.log(`Plasticity queue response status: ${plasticityStatusCode}`);

            if (plasticityResponse.ok) {
                const plasticityData = await plasticityResponse.json();
                console.log(`Plasticity queue data: ${JSON.stringify(plasticityData)}`);
                setPlasticityQueue(plasticityData.toString());
            } else {
                const errorText = await plasticityResponse.text();
                console.error(`Error fetching plasticity queue: ${plasticityStatusCode}`, errorText);
            }

            // Fetch visualization sampling rate
            console.log(`Fetching sampling rate from: ${api}/v1/system/cortical_area_visualization_skip_rate`);
            const samplingResponse = await fetch(`${api}/v1/system/cortical_area_visualization_skip_rate`);
            const samplingStatusCode = samplingResponse.status;
            console.log(`Sampling rate response status: ${samplingStatusCode}`);

            if (samplingResponse.ok) {
                const samplingData = await samplingResponse.json();
                console.log(`Sampling rate data: ${JSON.stringify(samplingData)}`);
                setSamplingRate(samplingData.toString());
            } else {
                const errorText = await samplingResponse.text();
                console.error(`Error fetching sampling rate: ${samplingStatusCode}`, errorText);
            }

        } catch (error) {
            console.error('Error fetching settings:', error);
            // Keep default values in case of error
        } finally {
            setIsLoading(false);
        }
    };

    // Validate input as float
    const validateFloat = (text) => {
        // Allow only numbers and a single decimal point
        return text.replace(/[^0-9.]/g, '')
            .replace(/(\..*)\./g, '$1');// Ensuring only one decimal point
    };

    // Validate input as integer
    const validateInt = (text) => {
        // Allow only numbers
        return text.replace(/[^0-9]/g, '');
    };

    // Handle applying changes
    const applyChanges = async () => {
        if (!api) {
            Alert.alert('Error', 'API connection not available');
            return;
        }

        setIsLoading(true);
        let success = true;
        let responseDetails = '';

        try {
            // Update refresh rate
            console.log(`Updating refresh rate to ${refreshRate}`);
            const refreshPayload = { burst_duration: parseFloat(refreshRate) };
            console.log(`Sending POST to ${api}/v1/burst_engine/stimulation_period with payload:`, JSON.stringify(refreshPayload));

            const refreshResponse = await fetch(`${api}/v1/burst_engine/stimulation_period`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(refreshPayload)
            });

            const refreshStatus = refreshResponse.status;
            console.log(`Refresh rate update status: ${refreshStatus}`);

            let refreshResponseText = '';
            try {
                const refreshResponseData = await refreshResponse.json();
                refreshResponseText = JSON.stringify(refreshResponseData);
                console.log(`Refresh rate response data: ${refreshResponseText}`);
            } catch (e) {
                refreshResponseText = await refreshResponse.text();
                console.log(`Refresh rate response text: ${refreshResponseText}`);
            }

            if (!refreshResponse.ok) {
                success = false;
                responseDetails += `Refresh rate error (${refreshStatus}): ${refreshResponseText}\n`;
            }

            // Update plasticity queue depth
            console.log(`Updating plasticity queue to ${plasticityQueue}`);
            // Send value as a query parameter instead of in the body
            const plasticityQueueUrl = `${api}/v1/neuroplasticity/plasticity_queue_depth?queue_depth=${plasticityQueue}`;
            console.log(`Sending PUT to ${plasticityQueueUrl}`);

            const plasticityResponse = await fetch(plasticityQueueUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const plasticityStatus = plasticityResponse.status;
            console.log(`Plasticity queue update status: ${plasticityStatus}`);

            let plasticityResponseText = '';
            try {
                const plasticityResponseData = await plasticityResponse.json();
                plasticityResponseText = JSON.stringify(plasticityResponseData);
                console.log(`Plasticity queue response data: ${plasticityResponseText}`);
            } catch (e) {
                plasticityResponseText = await plasticityResponse.text();
                console.log(`Plasticity queue response text: ${plasticityResponseText}`);
            }

            if (!plasticityResponse.ok) {
                success = false;
                responseDetails += `Plasticity queue error (${plasticityStatus}): ${plasticityResponseText}\n`;
            }

            // Update visualization sampling rate
            console.log(`Updating sampling rate to ${samplingRate}`);
            const samplingPayload = { cortical_viz_skip_rate: parseFloat(samplingRate) };
            console.log(`Sending PUT to ${api}/v1/system/cortical_area_visualization_skip_rate with payload:`, JSON.stringify(samplingPayload));
            const samplingResponse = await fetch(`${api}/v1/system/cortical_area_visualization_skip_rate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(samplingPayload)
            });
            const samplingStatus = samplingResponse.status;
            console.log(`Sampling rate update status: ${samplingStatus}`);
            let samplingResponseText = '';
            try {
                const samplingResponseData = await samplingResponse.json();
                samplingResponseText = JSON.stringify(samplingResponseData);
                console.log(`Sampling rate response data: ${samplingResponseText}`);
            } catch (e) {
                samplingResponseText = await samplingResponse.text();
                console.log(`Sampling rate response text: ${samplingResponseText}`);
            }
            if (!samplingResponse.ok) {
                success = false;
                responseDetails += `Sampling rate error (${samplingStatus}): ${samplingResponseText}\n`;
            }

            if (success) {
                console.log('All settings updated successfully');
                Alert.alert('Success', 'Settings updated successfully');
                goBack();
            } else {
                console.error('Some settings failed to update:', responseDetails);
                Alert.alert('Error', `Some settings failed to update:\n${responseDetails}`);
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
                <Text style={styles.title}>Brain Settings</Text>
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
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Refresh rate (Hz)</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={refreshRate}
                                onChangeText={text => setRefreshRate(validateFloat(text))}
                                keyboardType="decimal-pad"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Plasticity queue depth</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={plasticityQueue}
                                onChangeText={text => setPlasticityQueue(validateInt(text))}
                                keyboardType="number-pad"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Visualization sampling rate (Hz)</Text>
                            <TextInput
                                style={styles.settingInput}
                                value={samplingRate}
                                onChangeText={text => setSamplingRate(validateFloat(text))}
                                keyboardType="decimal-pad"
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
        padding: 20,
        backgroundColor: '#0A1A3A',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingLabel: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        marginRight: 10,
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
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#0A1A3A',
    },
    cancelButton: {
        backgroundColor: '#81D4FA',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    applyButton: {
        backgroundColor: '#81D4FA',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
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
        marginTop: 10,
        fontSize: 16,
    },
});

export default BrainSettingsPage;