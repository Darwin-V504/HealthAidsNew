import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getThemeColors } from '../infoutils/theme';

type Props = {
  symptom: string;
  onRemove?: () => void;
  selected?: boolean;
  onSelect?: () => void;
};

export default function SymptomChip({ symptom, onRemove, selected, onSelect }: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors, selected);

  if (onRemove) {
    return (
      <View style={styles.chip}>
        <Text style={styles.text}>{symptom}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.selectedChip]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {symptom}
      </Text>
    </TouchableOpacity>
  );
}

const getStyles = (colors: any, selected?: boolean) => StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: selected ? colors.primary : colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: selected ? colors.primary : colors.border,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 14,
    color: selected ? colors.white : colors.text,
    marginRight: 4,
  },
  selectedText: {
    color: colors.white,
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
});