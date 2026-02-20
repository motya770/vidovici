export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  lookingFor: string;
  education: string;
  profession: string;
  hobbies: string[];
  favoriteBooks: string[];
  favoriteMusic: string[];
  languages: string[];
  personalValues: string[];
  aboutMe: string;
  idealPartnerDescription: string;
}

export interface MatchCandidate {
  id: string;
  profile: UserProfile;
  generatedPrompt: string;
  compatibilityHighlights: string[];
}

export type RootStackParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  Discovery: undefined;
  PromptDetail: { candidate: MatchCandidate };
  MyProfile: undefined;
};
