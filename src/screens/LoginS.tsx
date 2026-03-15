import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CInput from "../components/CInput";
import CButton from "../components/CButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { useAuth } from "../contexts/AuthContext";
import { validateEmail } from "../infoutils/helpers/validators";

export default function LoginS({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Correo electrónico inválido');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.iconContainer}>
          <Text style={[styles.title, { color: colors.primary }]}>HealthAids</Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Iniciar Sesión
        </Text>

        <View style={styles.form}>
          <CInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />

          <CInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
          />

          <CButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="large"
          />

          <CButton
            title="¿No tienes cuenta? Regístrate"
            onPress={() => navigation.navigate('Register')}
            variant="tertiary"
            size="large"
          />
        </View>

        <TouchableOpacity
          style={styles.chatbotLink}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
          <Text style={[styles.chatbotLinkText, { color: colors.primary }]}>
            Hablar con asistente virtual
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 8,
  },
  chatbotLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  chatbotLinkText: {
    fontSize: 14,
  },
});