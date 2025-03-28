import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";

interface HelpModalProps {
    visible: boolean;
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
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
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Help</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✖</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.content}>
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
    modalContainer: {
        width: "80%",
        backgroundColor: "#003366",
        padding: 15,
        borderRadius: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
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
    content: {
        maxHeight: 300,
    },
};

export default HelpModal;
