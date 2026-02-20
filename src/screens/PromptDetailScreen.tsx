import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PromptDetail'>;

export default function PromptDetailScreen({ route, navigation }: Props) {
  const { candidate } = route.params;
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(candidate.generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Prompt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.introCard}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarInitial}>
              {candidate.profile.name.charAt(0)}
            </Text>
          </View>
          <Text style={styles.introName}>
            Learn about {candidate.profile.name}
          </Text>
          <Text style={styles.introDesc}>
            Copy this prompt and paste it into ChatGPT to get a personalized,
            positive description of {candidate.profile.name} and why you two
            might be a great match.
          </Text>
        </View>

        {candidate.compatibilityHighlights.length > 0 && (
          <View style={styles.highlightsCard}>
            <Text style={styles.highlightsTitle}>Quick Compatibility</Text>
            {candidate.compatibilityHighlights.map((h, i) => (
              <Text key={i} style={styles.highlightItem}>{h}</Text>
            ))}
          </View>
        )}

        <Text style={styles.promptLabel}>CHATGPT PROMPT</Text>
        <View style={styles.promptBox}>
          <Text style={styles.promptText} selectable>
            {candidate.generatedPrompt}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.copyButton, copied && styles.copyButtonCopied]}
          onPress={handleCopy}
        >
          <Text style={styles.copyButtonText}>
            {copied ? 'Copied to Clipboard!' : 'Copy Prompt'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  backText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#eaeaea',
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  introCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  avatarSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  introName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#eaeaea',
    marginBottom: 8,
  },
  introDesc: {
    fontSize: 14,
    color: '#8888a0',
    textAlign: 'center',
    lineHeight: 20,
  },
  highlightsCard: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ecdc4',
    marginBottom: 8,
  },
  highlightItem: {
    fontSize: 14,
    color: '#4ecdc4',
    marginBottom: 4,
    paddingLeft: 8,
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a6a88',
    letterSpacing: 1,
    marginBottom: 8,
  },
  promptBox: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1a4a7a',
  },
  promptText: {
    fontSize: 14,
    color: '#d0d0e8',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
  },
  copyButton: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  copyButtonCopied: {
    backgroundColor: '#4ecdc4',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
