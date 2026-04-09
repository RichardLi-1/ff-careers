import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RL</Text>
        </View>
        <Text style={styles.name}>Your Profile</Text>
        <Text style={styles.subtitle}>Track progress, update preferences, and manage account details here.</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>Getting set up</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#efeafc',
    marginBottom: 18,
  },
  avatarText: {
    color: '#333333',
    fontSize: 28,
    fontFamily: 'Glacial Indifference Bold',
  },
  name: {
    color: '#111111',
    fontSize: 28,
    marginBottom: 8,
    fontFamily: 'Glacial Indifference Bold',
  },
  subtitle: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Glacial Indifference',
  },
  infoCard: {
    width: '100%',
    maxWidth: 360,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoLabel: {
    color: '#333333',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'Glacial Indifference Bold',
  },
  infoValue: {
    color: '#111111',
    fontSize: 18,
    fontFamily: 'Glacial Indifference',
  },
});
