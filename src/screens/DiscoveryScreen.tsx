import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, UserProfile, MatchCandidate } from '../types';
import { loadProfile } from '../utils/storage';
import { buildMatchCandidate } from '../utils/promptGenerator';
import { sampleProfiles } from '../data/sampleProfiles';

type Props = NativeStackScreenProps<RootStackParamList, 'Discovery'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function DiscoveryScreen({ navigation }: Props) {
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    loadProfile().then(profile => {
      if (!profile) {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        return;
      }
      setMyProfile(profile);
      const matches = sampleProfiles.map(sp => buildMatchCandidate(profile, sp));
      setCandidates(matches);
    });
  }, [navigation]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swiped right — interested
          swipeCard('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swiped left — pass
          swipeCard('left');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  function swipeCard(direction: 'left' | 'right') {
    const toX = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(pan, {
      toValue: { x: toX, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      setCurrentIndex(prev => prev + 1);
    });
  }

  if (!myProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (currentIndex >= candidates.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>That's everyone for now!</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new people to discover
          </Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const candidate = candidates[currentIndex];
  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const rightOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
          <Text style={styles.profileLink}>My Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate },
              ],
            },
          ]}
        >
          {/* Swipe indicators */}
          <Animated.View style={[styles.swipeLabel, styles.likeLabel, { opacity: rightOpacity }]}>
            <Text style={styles.swipeLabelText}>INTERESTED</Text>
          </Animated.View>
          <Animated.View style={[styles.swipeLabel, styles.passLabel, { opacity: leftOpacity }]}>
            <Text style={[styles.swipeLabelText, { color: '#ff6b6b' }]}>PASS</Text>
          </Animated.View>

          <View style={styles.cardContent}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {candidate.profile.name.charAt(0)}
              </Text>
            </View>

            <Text style={styles.cardName}>
              {candidate.profile.name}, {candidate.profile.age}
            </Text>
            <Text style={styles.cardProfession}>{candidate.profile.profession}</Text>
            <Text style={styles.cardEducation}>{candidate.profile.education}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>HOBBIES</Text>
            <View style={styles.tagRow}>
              {candidate.profile.hobbies.map((h, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{h}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>VALUES</Text>
            <View style={styles.tagRow}>
              {candidate.profile.personalValues.map((v, i) => (
                <View key={i} style={[styles.tag, styles.valueTag]}>
                  <Text style={[styles.tagText, styles.valueTagText]}>{v}</Text>
                </View>
              ))}
            </View>

            {candidate.compatibilityHighlights.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>COMPATIBILITY</Text>
                {candidate.compatibilityHighlights.map((h, i) => (
                  <Text key={i} style={styles.highlightText}>{h}</Text>
                ))}
              </>
            )}
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => swipeCard('left')}
        >
          <Text style={styles.actionButtonText}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.promptButton]}
          onPress={() => navigation.navigate('PromptDetail', { candidate })}
        >
          <Text style={styles.promptButtonText}>Get Prompt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => swipeCard('right')}
        >
          <Text style={styles.actionButtonText}>Like</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Swipe or tap buttons below</Text>
    </SafeAreaView>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#eaeaea',
  },
  profileLink: {
    fontSize: 14,
    color: '#e94560',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 24,
  },
  swipeLabel: {
    position: 'absolute',
    top: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  likeLabel: {
    left: 24,
    borderColor: '#4ecdc4',
  },
  passLabel: {
    right: 24,
    borderColor: '#ff6b6b',
  },
  swipeLabelText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4ecdc4',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  cardName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#eaeaea',
    textAlign: 'center',
  },
  cardProfession: {
    fontSize: 16,
    color: '#a0a0b8',
    textAlign: 'center',
    marginTop: 4,
  },
  cardEducation: {
    fontSize: 14,
    color: '#6a6a88',
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a4a',
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a6a88',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#a0a0b8',
    fontSize: 13,
  },
  valueTag: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
  },
  valueTagText: {
    color: '#e94560',
  },
  highlightText: {
    color: '#4ecdc4',
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 80,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: '#2a2a4a',
  },
  likeButton: {
    backgroundColor: '#4ecdc4',
  },
  promptButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 32,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    color: '#555570',
    fontSize: 12,
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#eaeaea',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8888a0',
    textAlign: 'center',
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
