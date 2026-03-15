import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  icon?: string;
  error?: string;
  editable?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  required?: boolean;
};

export default function CInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  icon,
  error,
  editable = true,
  autoCapitalize = "none",
  maxLength,
  required = false,
}: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // Conversión explícita y forzada a booleano
  const isSecure = secureTextEntry === true;
  const isEditable = editable === true;
  const isRequired = required === true;
  const showRequired = isRequired && value === '';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          { borderColor: error ? colors.error : colors.border },
          !isEditable && { backgroundColor: colors.lightGray },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon as any}
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={isEditable}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
        {showRequired && (
          <Text style={[styles.required, { color: colors.error }]}>*</Text>
        )}
      </View>
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  required: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});