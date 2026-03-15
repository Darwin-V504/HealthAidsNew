// src/components/DoctorCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doctor } from '../infoutils/types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getThemeColors } from '../infoutils/theme';

type Props = {
  doctor: Doctor;
  onPress?: () => void;
  showAvailability?: boolean;
};

export default function DoctorCard({ doctor, onPress, showAvailability = true }: Props) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(theme);
  const styles = getStyles(colors);

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <Ionicons name="medical" size={40} color={colors.primary} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.specialty}>{doctor.specialty}</Text>
          </View>
        </View>
        
        {showAvailability && (
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: doctor.isAvailable ? colors.success + '20' : colors.error + '20' }
          ]}>
            <View style={[
              styles.availabilityDot,
              { backgroundColor: doctor.isAvailable ? colors.success : colors.error }
            ]} />
            <Text style={[
              styles.availabilityText,
              { color: doctor.isAvailable ? colors.success : colors.error }
            ]}>
              {doctor.isAvailable ? t('available') : t('notAvailable')}
            </Text>
          </View>
        )}
      </View>

      {doctor.experience && (
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {doctor.experience} años de experiencia
          </Text>
        </View>
      )}

      {doctor.rating && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
});