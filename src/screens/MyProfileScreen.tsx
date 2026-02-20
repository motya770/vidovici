import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, UserProfile } from '../types';
import { loadProfile, clearProfile } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'MyProfile'>;

export default function MyProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile().then(setProfile);
  }, []);

  function handleEditProfile() {
    navigation.navigate('ProfileSetup');
  }

  function handleResetProfile() {
    Alert.alert(
      'Reset Profile',
      'This will delete your profile and start fresh. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearProfile();
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
          },
        },
      ]
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{profile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{profile.name}, {profile.age}</Text>
          <Text style={styles.profession}>{profile.profession}</Text>
        </View>

        <ProfileSection title="Education" content={profile.education} />
        <ProfileSection title="About Me" content={profile.aboutMe} />
        <ProfileSection title="Looking For" content={profile.idealPartnerDescription} />

        <TagSection title="Hobbies" tags={profile.hobbies} />
        <TagSection title="Favorite Books" tags={profile.favoriteBooks} />
        <TagSection title="Music Taste" tags={profile.favoriteMusic} />
        <TagSection title="Languages" tags={profile.languages} />
        <TagSection title="Values" tags={profile.personalValues} variant="value" />

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetProfile}>
            <Text style={styles.resetButtonText}>Reset Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileSection({ title, content }: { title: string; content: string }) {
  if (!content || content === 'Not specified') return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
}

function TagSection({
  title,
  tags,
  variant,
}: {
  title: string;
  tags: string[];
  variant?: 'value';
}) {
  if (tags.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tagRow}>
        {tags.map((t, i) => (
          <View key={i} style={[styles.tag, variant === 'value' && styles.valueTag]}>
            <Text style={[styles.tagText, variant === 'value' && styles.valueTagText]}>
              {t}
            </Text>
          </View>
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
  loadingText: {
    color: '#a0a0b8',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
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
    padding: 24,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#eaeaea',
  },
  profession: {
    fontSize: 16,
    color: '#a0a0b8',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6a6a88',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#d0d0e8',
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#16213e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  tagText: {
    color: '#a0a0b8',
    fontSize: 14,
  },
  valueTag: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  valueTagText: {
    color: '#e94560',
  },
  buttonGroup: {
    marginTop: 16,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
});
