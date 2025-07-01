import React, { ReactElement } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { AppText } from "../Text/AppText";

export interface ResizingButtonProps {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    icon?: ReactElement;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    scale?: number;
    title: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
}

const DURATION = 100;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderRadius: 16,
        flexDirection: "row",
        height: 52,
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 0,
        borderWidth: 1,
        position: "relative",
    },
    iconContainer: {
        position: "absolute",
        left: 30,
        zIndex: 1,
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    contentGroup: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
    },
});

export const ResizingButton = ({
    accessibilityHint,
    accessibilityLabel,
    icon,
    isDisabled = false,
    isLoading = false,
    onPress,
    scale = 0.97,
    title,
    backgroundColor = "#14F195",
    textColor = "#000",
    borderColor = "transparent",
}: ResizingButtonProps) => {
    const transition = useSharedValue(0);
    const isActive = useSharedValue(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(transition.value, [0, 1], [1, scale]),
            },
        ],
    }));


    return (
        <Pressable
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{
                busy: isLoading,
                disabled: isDisabled || isLoading,
            }}
            disabled={isDisabled || isLoading}
            hitSlop={16}
            onPress={onPress}
            onPressIn={() => {
                isActive.value = true;
                transition.value = withTiming(1, { duration: DURATION }, () => {
                    if (!isActive.value) {
                        transition.value = withTiming(0, {
                            duration: DURATION,
                        });
                    }
                });
            }}
            onPressOut={() => {
                if (transition.value === 1) {
                    transition.value = withTiming(0, { duration: DURATION });
                }
                isActive.value = false;
            }}
        >
            <Animated.View
                style={[
                    styles.container,
                    animatedStyle,
                    {
                        backgroundColor,
                        borderColor,
                        opacity: isDisabled ? 0.5 : 1,
                    },
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color={textColor} size={18} />
                ) : (
                    <Animated.View style={styles.contentGroup}>
                        {icon && (
                            <Animated.View style={styles.iconContainer}>
                                {icon}
                            </Animated.View>
                        )}
                        <Animated.View style={styles.textContainer}>
                            <AppText variant="bodyLarge" fontWeight="semiBold" numberOfLines={1} color={textColor}>
                                {title}
                            </AppText>
                        </Animated.View>
                    </Animated.View>
                )}
            </Animated.View>
        </Pressable>
    );
};