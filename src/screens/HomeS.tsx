import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { useAuth } from "../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUpcomingAppointments } from "../store/appointmentsSlice";
import AppointmentCard from "../components/AppointmentCard";

export default function HomeS({ navigation }: any) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { upcoming, loading } = useAppSelector(state => state.appointments);

  useEffect(() => {
    if (user) {
      dispatch(fetchUpcomingAppointments(user.id));
    }
  }, [user]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.white }]}>Bienvenido,</Text>
          <Text style={[styles.userName, { color: colors.white }]}>
            {user?.name || 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle" size={50} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="chatbubble" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Asistente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickAction}
          onPress={() => navigation.navigate('Appointments')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft + '20' }]}>
            <Ionicons name="calendar" size={24} color={colors.primarySoft} />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Mis Citas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximas Citas</Text>

        {loading ? (
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Cargando...
          </Text>
        ) : upcoming.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No tienes citas próximas
            </Text>
            <TouchableOpacity
              style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Chatbot')}
            >
              <Text style={[styles.scheduleButtonText, { color: colors.white }]}>
                Agendar cita
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          upcoming.slice(0, 2).map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onPress={() => navigation.navigate('Appointments')}
              showActions={false}
            />
          ))
        )}

        {upcoming.length > 2 && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('Appointments')}
          >
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              Ver todas las citas
            </Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.section, styles.tipsSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Consejo del día</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={colors.warning} />
          <Text style={[styles.tipText, { color: colors.text }]}>
            Bebe al menos 8 vasos de agua al día para mantener una buena hidratación.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.chatbotButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Ionicons name="chatbubble" size={20} color={colors.white} />
        <Text style={[styles.chatbotButtonText, { color: colors.white }]}>
          Hablar con asistente
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickAction: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    marginVertical: 12,
  },
  scheduleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonText: {
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    marginRight: 4,
  },
  tipsSection: {
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontStyle: 'italic',
  },
  chatbotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    gap: 8,
  },
  chatbotButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});