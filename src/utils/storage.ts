import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const PROFILE_KEY = 'vidovici_user_profile';

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(PROFILE_KEY);
  if (!data) return null;
  return JSON.parse(data) as UserProfile;
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_KEY);
}
