import { ReactElement } from "react";
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
    height?: number;
    width?: number;
    fontSize?: number; // Nuevo prop opcional
}

const DURATION = 100;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "row",
        height: 52,
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 0,
        borderWidth: 1,
        position: "relative",
        // El borderRadius se aplicará dinámicamente en el componente
    },
    iconContainer: {
        marginRight: 8,
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    contentGroup: {
        flexDirection: "row",
        alignItems: "center",
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
    scale = 0.95,
    title,
    backgroundColor = "#14F195",
    textColor = "#000",
    borderColor = "transparent",
    height = 52,
    width,
    fontSize, // Nuevo prop
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
                    dynamicContainerStyle,
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
                            {/* 
                              Usamos una función sublineal para que el tamaño del texto crezca más lento que linealmente.
                              Por ejemplo, usando la raíz cuadrada: fontSize = 6 + Math.sqrt(height) * 3.5
                              Así, para valores pequeños de height, el texto no se hace demasiado pequeño.
                            */}
                            <AppText fontSize={resolvedFontSize} fontWeight="semiBold" numberOfLines={1} color={textColor}>
                                {title}
                            </AppText>
                        </Animated.View>
                    </Animated.View>
                )}
            </Animated.View>
        </Pressable>
    );
};