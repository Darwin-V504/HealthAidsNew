import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

type Props = {
  size?: "small" | "large";
};

export default function LoadingSpinner({ size = "large" }: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});