import { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CInput from "../components/CInput";
import CButton from "../components/CButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail, validatePassword, validateName, validatePhone } from "../infoutils/helpers/validators";

export default function RegisterS({ navigation }: any) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { register } = useAuth();

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    // Limpiar error del campo cuando el usuario escribe
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    };
    let isValid = true;

    if (!validateName(form.name)) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    if (!validateEmail(form.email)) {
      newErrors.email = 'Correo electrónico inválido';
      isValid = false;
    }

    if (!validatePassword(form.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = 'Teléfono inválido (solo números, 7-15 dígitos)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const success = await register(form.name, form.email, form.password, form.phone);
      if (success) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return form.name.trim() !== '' &&
           form.email.trim() !== '' &&
           validateEmail(form.email) &&
           form.password.trim() !== '' &&
           form.password.length >= 6 &&
           form.password === form.confirmPassword;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Crear Cuenta</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Completa tus datos para registrarte
        </Text>

        <View style={styles.form}>
          <CInput
            placeholder="Nombre completo"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            icon="person-outline"
            error={errors.name}
            required
          />

          <CInput
            placeholder="Correo electrónico"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            icon="mail-outline"
            error={errors.email}
            required
          />

          <CInput
            placeholder="Teléfono (opcional)"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
            icon="call-outline"
            error={errors.phone}
          />

          <CInput
            placeholder="Contraseña"
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.password}
            required
          />

          <CInput
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
            icon="lock-closed-outline"
            error={errors.confirmPassword}
            required
          />

          <CButton
            title="Registrarme"
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid()}
            variant="primary"
            size="large"
          />

          <CButton
            title="¿Ya tienes cuenta? Inicia sesión"
            onPress={() => navigation.navigate('Login')}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 8,
  },
});