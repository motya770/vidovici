import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Vidovici</Text>
        <Text style={styles.tagline}>
          Discover people through words,{'\n'}not photos
        </Text>

        <View style={styles.featureList}>
          <FeatureItem
            icon="1"
            title="Build your profile"
            desc="Share your hobbies, books, values, and what makes you, you"
          />
          <FeatureItem
            icon="2"
            title="Discover matches"
            desc="Browse profiles based on personality, not appearance"
          />
          <FeatureItem
            icon="3"
            title="Get your prompt"
            desc="Copy a personalized ChatGPT prompt to learn about your match"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProfileSetup')}
        >
          <Text style={styles.buttonText}>Create My Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureIconText}>{icon}</Text>
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#a0a0b8',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
  },
  featureList: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16213e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#eaeaea',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#8888a0',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
