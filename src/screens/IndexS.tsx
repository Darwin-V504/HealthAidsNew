import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { useAuth } from "../contexts/AuthContext";

export default function IndexS({ navigation }: any) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { isAuthenticated } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <Ionicons name="medical" size={80} color={colors.white} />
        <Text style={[styles.title, { color: colors.white }]}>HealthAids</Text>
        <Text style={[styles.subtitle, { color: colors.white }]}>
          Tu salud en nuestras manos
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Bienvenido a HealthAids
        </Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Gestiona tus citas médicas, consulta tu historial y obtén asistencia virtual
        </Text>

        <View style={styles.buttonContainer}>
          {!isAuthenticated ? (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primarySoft }]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.buttonText, { color: colors.white }]}>
                  Registrarse
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Ir al Inicio
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.chatbotButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Ionicons name="chatbubble" size={20} color={colors.primary} />
            <Text style={[styles.chatbotButtonText, { color: colors.primary }]}>
              Asistente Virtual
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatbotButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
  },
  chatbotButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});