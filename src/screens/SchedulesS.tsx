import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { useAuth } from "../contexts/AuthContext";
import CInput from "../components/CInput";
import CButton from "../components/CButton";
import { appointmentService } from "../services/appointmentService";

export default function SchedulesS({ navigation }: any) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { user } = useAuth();

  const [form, setForm] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!form.doctorName.trim()) {
      Alert.alert('Error', 'El nombre del doctor es requerido');
      return;
    }
    if (!form.specialty.trim()) {
      Alert.alert('Error', 'La especialidad es requerida');
      return;
    }
    if (!form.date.trim()) {
      Alert.alert('Error', 'La fecha es requerida (YYYY-MM-DD)');
      return;
    }
    if (!form.time.trim()) {
      Alert.alert('Error', 'La hora es requerida (HH:MM)');
      return;
    }
    if (!form.reason.trim()) {
      Alert.alert('Error', 'El motivo de la consulta es requerido');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'Debes iniciar sesión para agendar una cita');
      return;
    }

    setLoading(true);
    try {
      // ✅ FORZAR QUE userId SEA NÚMERO
      const userId = Number(user.id);
      console.log('📤 Enviando cita para usuario ID:', userId, 'Tipo:', typeof userId);

      // ✅ DATOS CON EL NOMBRE CORRECTO: clientId (minúscula)
      const appointmentData = {
        clientId: userId,
        doctorName: form.doctorName.trim(),
        specialty: form.specialty.trim(),
        date: form.date.trim(),
        time: form.time.trim(),
        reason: form.reason.trim(),
        status: 'pending',
      };

      console.log('📤 Datos completos a enviar:', appointmentData);

      const response = await appointmentService.createAppointment(appointmentData);

      console.log('📦 Respuesta del servidor:', response);

      if (response.success) {
        Alert.alert(
          'Éxito', 
          'Cita agendada exitosamente',
          [
            {
              text: 'Ver mis citas',
              onPress: () => {
                // Navegar a MainTabs y luego a Appointments con refresh
                navigation.navigate('MainTabs', {
                  screen: 'Appointments',
                  params: { refresh: true }
                });
              }
            },
            {
              text: 'Agendar otra',
              onPress: () => {
                setForm({
                  doctorName: '',
                  specialty: '',
                  date: '',
                  time: '',
                  reason: '',
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'No se pudo agendar la cita');
      }
    } catch (error: any) {
      console.error('❌ Error creating appointment:', error);
      Alert.alert('Error', error.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Agendar Cita</Text>

        <View style={styles.form}>
          <CInput
            placeholder="Nombre del doctor"
            value={form.doctorName}
            onChangeText={(text) => handleChange('doctorName', text)}
            icon="person-outline"
          />

          <CInput
            placeholder="Especialidad"
            value={form.specialty}
            onChangeText={(text) => handleChange('specialty', text)}
            icon="medical-outline"
          />

          <CInput
            placeholder="Fecha (YYYY-MM-DD)"
            value={form.date}
            onChangeText={(text) => handleChange('date', text)}
            icon="calendar-outline"
          />

          <CInput
            placeholder="Hora (HH:MM)"
            value={form.time}
            onChangeText={(text) => handleChange('time', text)}
            icon="time-outline"
          />

          <CInput
            placeholder="Motivo de la consulta"
            value={form.reason}
            onChangeText={(text) => handleChange('reason', text)}
            icon="chatbubble-outline"
            
          />

          <CButton
            title="Agendar cita"
            onPress={handleSubmit}
            loading={loading}
            variant="primary"
            size="large"
          />

          <CButton
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="tertiary"
            size="large"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 8,
  },
});