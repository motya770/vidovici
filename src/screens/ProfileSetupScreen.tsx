import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, UserProfile } from '../types';
import { saveProfile } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

function generateId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function ProfileSetupScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [hobbiesText, setHobbiesText] = useState('');
  const [booksText, setBooksText] = useState('');
  const [musicText, setMusicText] = useState('');
  const [languagesText, setLanguagesText] = useState('');
  const [valuesText, setValuesText] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [idealPartner, setIdealPartner] = useState('');

  const steps = [
    { title: 'The Basics', subtitle: 'Let\'s start with who you are' },
    { title: 'Your Background', subtitle: 'Education & career shape who we become' },
    { title: 'Your Passions', subtitle: 'What lights you up?' },
    { title: 'Your Favorites', subtitle: 'Books, music, and more' },
    { title: 'The Real You', subtitle: 'In your own words' },
  ];

  function splitByComma(text: string): string[] {
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  async function handleFinish() {
    if (!name.trim() || !age.trim()) {
      Alert.alert('Missing info', 'Please fill in at least your name and age.');
      return;
    }

    const profile: UserProfile = {
      id: generateId(),
      name: name.trim(),
      age: parseInt(age, 10) || 25,
      gender: gender.trim() || 'Prefer not to say',
      lookingFor: lookingFor.trim() || 'Anyone',
      education: education.trim() || 'Not specified',
      profession: profession.trim() || 'Not specified',
      hobbies: splitByComma(hobbiesText),
      favoriteBooks: splitByComma(booksText),
      favoriteMusic: splitByComma(musicText),
      languages: splitByComma(languagesText),
      personalValues: splitByComma(valuesText),
      aboutMe: aboutMe.trim() || 'Just getting started here!',
      idealPartnerDescription: idealPartner.trim() || 'Someone interesting and kind.',
    };

    await saveProfile(profile);
    navigation.reset({ index: 0, routes: [{ name: 'Discovery' }] });
  }

  function canGoNext(): boolean {
    if (step === 0) return name.trim().length > 0 && age.trim().length > 0;
    return true;
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <>
            <InputField label="Your name" value={name} onChangeText={setName} placeholder="Alex" />
            <InputField label="Age" value={age} onChangeText={setAge} placeholder="28" keyboardType="numeric" />
            <GenderSelector label="I am" value={gender} onSelect={setGender} />
            <GenderSelector label="Looking for" value={lookingFor} onSelect={setLookingFor} />
          </>
        );
      case 1:
        return (
          <>
            <InputField label="Education" value={education} onChangeText={setEducation} placeholder="e.g. BA in Design, UCLA" />
            <InputField label="Profession" value={profession} onChangeText={setProfession} placeholder="e.g. Product Designer" />
          </>
        );
      case 2:
        return (
          <>
            <InputField
              label="Hobbies & Interests"
              value={hobbiesText}
              onChangeText={setHobbiesText}
              placeholder="hiking, cooking, reading (comma-separated)"
              multiline
            />
            <InputField
              label="Personal Values"
              value={valuesText}
              onChangeText={setValuesText}
              placeholder="honesty, creativity, kindness (comma-separated)"
              multiline
            />
          </>
        );
      case 3:
        return (
          <>
            <InputField
              label="Favorite Books"
              value={booksText}
              onChangeText={setBooksText}
              placeholder="The Alchemist, Sapiens (comma-separated)"
              multiline
            />
            <InputField
              label="Music Taste"
              value={musicText}
              onChangeText={setMusicText}
              placeholder="jazz, indie, lo-fi (comma-separated)"
              multiline
            />
            <InputField
              label="Languages"
              value={languagesText}
              onChangeText={setLanguagesText}
              placeholder="English, Spanish (comma-separated)"
              multiline
            />
          </>
        );
      case 4:
        return (
          <>
            <InputField
              label="About me"
              value={aboutMe}
              onChangeText={setAboutMe}
              placeholder="Tell people what makes you, you. What do you care about? What does a perfect weekend look like?"
              multiline
              tall
            />
            <InputField
              label="My ideal partner"
              value={idealPartner}
              onChangeText={setIdealPartner}
              placeholder="Describe the kind of person you'd love to meet. What qualities matter most?"
              multiline
              tall
            />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[styles.progressDot, i <= step && styles.progressDotActive]}
              />
            ))}
          </View>

          <Text style={styles.stepTitle}>{steps[step].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[step].subtitle}</Text>

          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, !canGoNext() && styles.nextButtonDisabled]}
            onPress={() => {
              if (!canGoNext()) return;
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                handleFinish();
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {step === steps.length - 1 ? 'Start Discovering' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  tall,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'numeric' | 'default';
  multiline?: boolean;
  tall?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          tall && styles.inputTall,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555570"
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function GenderSelector({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: string;
  onSelect: (val: string) => void;
}) {
  const options = ['Male', 'Female', 'Other'];
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, value === opt && styles.chipActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, value === opt && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  progressDot: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2a2a4a',
  },
  progressDotActive: {
    backgroundColor: '#e94560',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#eaeaea',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#8888a0',
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a0b8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#eaeaea',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },
  inputTall: {
    minHeight: 120,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  chipActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  chipText: {
    color: '#8888a0',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  backButtonText: {
    color: '#a0a0b8',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#3a3a5a',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
