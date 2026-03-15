import { StyleSheet, Text, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  loading?: boolean;
};

const { width } = Dimensions.get('window');

export default function CButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  size = "medium",
  loading = false,
}: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // Conversión explícita a booleano
  const isDisabled = disabled === true;
  const isLoading = loading === true;

  const getBackgroundColor = () => {
    if (isDisabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.primarySoft;
      case 'danger': return colors.error;
      default: return 'transparent';
    }
  };

  const getTextColor = () => {
    if (isDisabled) return colors.gray;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return colors.white;
      default: return colors.primary;
    }
  };

  const sizeStyles = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      width: width * 0.3,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      width: width * 0.6,
    },
    large: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      width: width * 0.85,
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        sizeStyles[size],
        variant === 'tertiary' && {
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor: 'transparent',
        },
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.buttonTitle, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});