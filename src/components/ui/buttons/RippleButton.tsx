import React, { ReactElement } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../../../constants/Colors";
import { AppText } from "../Text/AppText";
import { PlatformTouchable } from "./PlatformTouchable";

export interface RippleButtonProps {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    icon?: ReactElement;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    title: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    height?: number;
    width?: number;
    rippleColor?: string;
    borderless?: boolean;
    fontSize?: number; // Nuevo prop opcional
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "row",
        height: 52,
        justifyContent: "center",
        paddingVertical: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 0,
        borderWidth: 1,
        position: "relative",
        paddingHorizontal: 16,
        // El borderRadius se aplicará dinámicamente en el componente
    },
    iconContainer: {
        marginRight: 8,
    },
    textContainer: {
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    contentGroup: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});

export const RippleButton = ({
    accessibilityHint,
    accessibilityLabel,
    icon,
    isDisabled = false,
    isLoading = false,
    onPress,
    title,
    backgroundColor = "#14F195",
    textColor = "#000",
    borderColor = "transparent",
    height = 52,
    width,
    rippleColor = Colors.appleRed,
    borderless = false,
    fontSize, // Nuevo prop
}: RippleButtonProps) => {
    // Calcula el borderRadius dinámicamente según la altura
    const dynamicContainerStyle = {
        backgroundColor,
        borderColor,
        opacity: isDisabled ? 0.5 : 1,
        height,
        width,
        borderRadius: height / 4,
    };

    // Calcula el fontSize si no se especifica
    const resolvedFontSize = fontSize ?? (6 + Math.sqrt(height) * 1.6);

    return (
        <PlatformTouchable
            style={[styles.container, dynamicContainerStyle]}
            onPress={onPress}
            disabled={isDisabled || isLoading}
            rippleColor={Colors.white}
            borderless={borderless}
        >
            <View style={styles.contentGroup}>
                {isLoading ? (
                    <ActivityIndicator color={textColor} size={18} />
                ) : (
                    <>
                        {icon && (
                            <View style={styles.iconContainer}>{icon}</View>
                        )}
                        <View style={styles.textContainer}>
                            <AppText fontSize={resolvedFontSize} fontWeight="semiBold" numberOfLines={1} color={textColor}>
                                {title}
                            </AppText>
                        </View>
                    </>
                )}
            </View>
        </PlatformTouchable>
    );
}; 