import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { useAuth } from "../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAppointments, cancelAppointment } from "../store/appointmentsSlice";
import AppointmentCard from "../components/AppointmentCard";

type FilterType = 'upcoming' | 'history' | 'all';

export default function AppointmentsS({ navigation, route }: any) {
  const [filter, setFilter] = useState<FilterType>('upcoming');
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { appointments, upcoming, history, loading } = useAppSelector((state) => state.appointments);

  // Cargar citas cuando la pantalla se enfoca o cuando se recibe params.refresh
  useEffect(() => {
    if (user) {
     
      dispatch(fetchAppointments(user.id));
    }
  }, [user, dispatch]);

  // Recargar cuando la pantalla recibe foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user) {
        dispatch(fetchAppointments(user.id));
      }
    });

    return unsubscribe;
  }, [navigation, user, dispatch]);


  useEffect(() => {
    if (route.params?.refresh && user) {
      
      dispatch(fetchAppointments(user.id));
      // Limpiar el parámetro para evitar recargas infinitas
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh, user, dispatch]);

  const handleCancel = (appointmentId: number) => {
    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro de cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            if (user) {
              dispatch(cancelAppointment({ userId: user.id, appointmentId }));
            }
          }
        }
      ]
    );
  };

  const getFilteredAppointments = () => {
    switch (filter) {
      case 'upcoming':
        return upcoming;
      case 'history':
        return history;
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.filterContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'upcoming' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'upcoming' ? colors.white : colors.textSecondary },
            ]}
          >
            Próximas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'history' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('history')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'history' ? colors.white : colors.textSecondary },
            ]}
          >
            Historial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? colors.white : colors.textSecondary },
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {loading ? (
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando...</Text>
        ) : filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay citas</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {filter === 'upcoming'
                ? 'No tienes citas programadas'
                : filter === 'history'
                ? 'No tienes citas en el historial'
                : 'No tienes citas registradas'}
            </Text>
            <TouchableOpacity
              style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Schedules')}
            >
              <Text style={[styles.scheduleButtonText, { color: colors.white }]}>
                Agendar cita
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => handleCancel(appointment.id)}
              showActions={appointment.status === 'pending'}
            />
          ))
        )}
      </ScrollView>

      {filter !== 'history' && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Schedules')}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  scheduleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  scheduleButtonText: {
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});