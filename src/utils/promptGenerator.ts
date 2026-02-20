import { UserProfile, MatchCandidate } from '../types';

export function generateChatGPTPrompt(viewer: UserProfile, candidate: UserProfile): string {
  const hobbiesStr = candidate.hobbies.length > 0
    ? candidate.hobbies.join(', ')
    : 'various activities';

  const booksStr = candidate.favoriteBooks.length > 0
    ? candidate.favoriteBooks.join(', ')
    : 'a variety of genres';

  const musicStr = candidate.favoriteMusic.length > 0
    ? candidate.favoriteMusic.join(', ')
    : 'diverse music';

  const valuesStr = candidate.personalValues.length > 0
    ? candidate.personalValues.join(', ')
    : 'meaningful connections';

  const languagesStr = candidate.languages.length > 0
    ? candidate.languages.join(', ')
    : '';

  const viewerHobbies = viewer.hobbies.length > 0
    ? viewer.hobbies.join(', ')
    : 'various activities';

  const prompt = `I'm exploring a connection with someone and I'd love your help understanding if we might be a great match. Here's what I know about this person — please highlight their most positive qualities, what makes them interesting, and how we might connect well together.

About this person:
- Name: ${candidate.name}, Age: ${candidate.age}
- Education: ${candidate.education}
- Profession: ${candidate.profession}
- Hobbies & Interests: ${hobbiesStr}
- Favorite Books: ${booksStr}
- Music Taste: ${musicStr}
- Values: ${valuesStr}${languagesStr ? `\n- Languages: ${languagesStr}` : ''}
- In their own words: "${candidate.aboutMe}"
- What they're looking for: "${candidate.idealPartnerDescription}"

About me (for compatibility context):
- My hobbies: ${viewerHobbies}
- What I'm looking for: "${viewer.idealPartnerDescription}"

Please write a warm, positive, and thoughtful description of this person. Focus on:
1. What makes them unique and interesting as a person
2. Their positive personality traits based on their interests and values
3. Potential conversation starters we could bond over
4. Why we might be compatible based on our shared or complementary interests
5. A creative "first date idea" that would suit both our personalities

Keep the tone friendly, optimistic, and respectful. No photos needed — let the personality shine through words!`;

  return prompt;
}

export function generateCompatibilityHighlights(
  viewer: UserProfile,
  candidate: UserProfile
): string[] {
  const highlights: string[] = [];

  const sharedHobbies = viewer.hobbies.filter(h =>
    candidate.hobbies.some(ch => ch.toLowerCase() === h.toLowerCase())
  );
  if (sharedHobbies.length > 0) {
    highlights.push(`Shared hobbies: ${sharedHobbies.join(', ')}`);
  }

  const sharedBooks = viewer.favoriteBooks.filter(b =>
    candidate.favoriteBooks.some(cb => cb.toLowerCase() === b.toLowerCase())
  );
  if (sharedBooks.length > 0) {
    highlights.push(`Both love: ${sharedBooks.join(', ')}`);
  }

  const sharedValues = viewer.personalValues.filter(v =>
    candidate.personalValues.some(cv => cv.toLowerCase() === v.toLowerCase())
  );
  if (sharedValues.length > 0) {
    highlights.push(`Shared values: ${sharedValues.join(', ')}`);
  }

  const sharedLanguages = viewer.languages.filter(l =>
    candidate.languages.some(cl => cl.toLowerCase() === l.toLowerCase())
  );
  if (sharedLanguages.length > 0) {
    highlights.push(`Both speak: ${sharedLanguages.join(', ')}`);
  }

  const sharedMusic = viewer.favoriteMusic.filter(m =>
    candidate.favoriteMusic.some(cm => cm.toLowerCase() === m.toLowerCase())
  );
  if (sharedMusic.length > 0) {
    highlights.push(`Music taste: ${sharedMusic.join(', ')}`);
  }

  if (highlights.length === 0) {
    highlights.push('Complementary personalities — discover something new!');
  }

  return highlights;
}

export function buildMatchCandidate(
  viewer: UserProfile,
  candidate: UserProfile
): MatchCandidate {
  return {
    id: candidate.id,
    profile: candidate,
    generatedPrompt: generateChatGPTPrompt(viewer, candidate),
    compatibilityHighlights: generateCompatibilityHighlights(viewer, candidate),
  };
}
