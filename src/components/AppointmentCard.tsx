import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { Appointment } from "../infoutils/types";
import { formatDate, formatTime, getStatusColor, getStatusText } from "../infoutils/helpers/dateHelpers";

type Props = {
  appointment: Appointment;
  onPress?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
};

export default function AppointmentCard({
  appointment,
  onPress,
  onCancel,
  showActions = true,
}: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const statusColor = getStatusColor(appointment.status);
  
  const hasOnPress = onPress !== undefined && onPress !== null;
  const shouldShowActions = showActions === true;

  
  const displaySpecialty = appointment.doctorSpecialty || appointment.specialty || 'Especialidad no especificada';
  
 
  const displayDate = appointment.appointmentDate || appointment.date;
  
 
  const displayTime = appointment.time || appointment.appointmentDate;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card },
        appointment.status === "cancelled" && styles.cancelledCard,
      ]}
      onPress={onPress}
      disabled={!hasOnPress}
    >
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
          <View style={styles.doctorDetails}>
            <Text style={[styles.doctorName, { color: colors.text }]}>
              {appointment.doctorName}
            </Text>
            <Text style={[styles.specialty, { color: colors.textSecondary }]}>
              {displaySpecialty}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusText(appointment.status)}
          </Text>
        </View>
      </View>

      <View style={[styles.details, { borderTopColor: colors.border }]}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {formatDate(displayDate)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {formatTime(displayTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={2}>
            {appointment.reason}
          </Text>
        </View>
      </View>

      {shouldShowActions && appointment.status === "pending" && (
        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + "10" }]}
            onPress={onCancel}
          >
            <Ionicons name="close" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelledCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  doctorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  specialty: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  details: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
});