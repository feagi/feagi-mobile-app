import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Markdown from "react-native-markdown-display";
import { Ionicons } from '@expo/vector-icons';

interface HelpModalProps {
    visible: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
    const [currentOrientation, setCurrentOrientation] = useState<'portrait' | 'landscape'>('portrait');

    // Detect initial orientation
    useEffect(() => {
        const { width, height } = Dimensions.get('window');
        const initialOrientation = width > height ? 'landscape' : 'portrait';
        setCurrentOrientation(initialOrientation);

        //event listener for orientation changes
        const handleOrientationChange = ({ window }) => {
            const { width, height } = window;
            setCurrentOrientation(width > height ? 'landscape' : 'portrait');
        };

        const subscription = Dimensions.addEventListener('change', handleOrientationChange);

        // Cleanup
        return () => {
            subscription.remove();
        };
    }, []);

    const markdownContent = `
# FEAGI Mobile App Help
This is a Scrollable markdown container.

- It can include images
- Include bullet points
- Different heading sizes
- To be added :O

![Example Image](https://example.com/sample-image.png)
`;

    const markdownStyles = {
        text: {
            color: "white", // Gold color for all text
        },
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            supportedOrientations={['portrait', 'landscape']}
            onOrientationChange={(orientation) => {
                setCurrentOrientation(orientation);
            }}
        >
            <View style={styles.overlay}>
                <View style={currentOrientation === 'landscape' ? styles.modalContainerLandscape : styles.modalContainerPortrait}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Help</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={
                        currentOrientation === 'landscape'
                            ? styles.contentLandscape
                            : styles.contentPortrait
                    }>
                        <Markdown style={markdownStyles}>{markdownContent}</Markdown>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainerPortrait: {
        width: "80%",
        backgroundColor: "#0A1A3A",
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    modalContainerLandscape: {
        width: "90%",
        maxWidth: 700,
        backgroundColor: "#0A1A3A",
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    closeButton: {
        padding: 5,
    },
    closeText: {
        fontSize: 18,
        color: "white",
    },
    contentPortrait: {
        maxHeight: 400,
    },
    contentLandscape: {
        maxHeight: 250,
    },
};

export default HelpModal;