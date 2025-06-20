import React, { ReactElement } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export interface ResizingButtonCircularProps {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    icon?: ReactElement;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    scale?: number;
    backgroundColor?: string;
    size?: number;
}

const DURATION = 100;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 0,
    },
});

export const ResizingButtonCircular = ({
    accessibilityHint,
    accessibilityLabel,
    icon,
    isDisabled = false,
    isLoading = false,
    onPress,
    scale = 0.85,
    backgroundColor = "#ffffff",
    size = 56,
}: ResizingButtonCircularProps) => {
    const transition = useSharedValue(0);
    const isActive = useSharedValue(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(transition.value, [0, 1], [1, scale]),
            },
        ],
    }));

    const containerStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        opacity: isDisabled ? 0.5 : 1,
    };

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
                    containerStyle,
                    animatedStyle,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color="#000" size={18} />
                ) : (
                    icon
                )}
            </Animated.View>
        </Pressable>
    );
}; 