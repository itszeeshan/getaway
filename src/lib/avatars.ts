export type Hairstyle =
  | 'long'
  | 'twintails'
  | 'bob'
  | 'ponytail'
  | 'spiky'
  | 'messy'
  | 'undercut'
  | 'curly';

export interface CardTheme {
  primary: string; // card back panel
  dark: string; // panel gradient end / deep lines
  light: string; // pattern line work
  accent: string; // pattern highlights
}

export interface AvatarDef {
  id: string;
  name: string;
  gender: 'female' | 'male';
  hairstyle: Hairstyle;
  skinTone: string;
  hairColor: string;
  hairShade: string; // darker tone for depth
  eyeColor: string;
  shirtColor: string;
  accentColor: string; // ties, pins, collar details
  bgFrom: string; // portrait frame gradient
  bgTo: string;
  card: CardTheme; // every character carries their own card skin
}

export const AVATARS: AvatarDef[] = [
  {
    id: 'yuki', name: 'Yuki', gender: 'female', hairstyle: 'long',
    skinTone: '#ffe3cf', hairColor: '#cdd7e8', hairShade: '#aab8d2', eyeColor: '#4a7fd4',
    shirtColor: '#8fb8de', accentColor: '#ffd166', bgFrom: '#dceefb', bgTo: '#b3d6f2',
    card: { primary: '#4a6fa8', dark: '#2c4470', light: '#bfd2ec', accent: '#ffd166' },
  },
  {
    id: 'hana', name: 'Hana', gender: 'female', hairstyle: 'twintails',
    skinTone: '#ffe3cf', hairColor: '#f7a8c4', hairShade: '#e087aa', eyeColor: '#c85a82',
    shirtColor: '#f8c9d8', accentColor: '#ff6b6b', bgFrom: '#ffe4ee', bgTo: '#fbc4d8',
    card: { primary: '#e26a92', dark: '#a83d63', light: '#ffd0e0', accent: '#ffd166' },
  },
  {
    id: 'mei', name: 'Mei', gender: 'female', hairstyle: 'bob',
    skinTone: '#f6d3b3', hairColor: '#54c2b5', hairShade: '#3aa093', eyeColor: '#2a8577',
    shirtColor: '#bde8e2', accentColor: '#ffd166', bgFrom: '#dcf5f1', bgTo: '#b5e6df',
    card: { primary: '#2fa896', dark: '#1d7365', light: '#bdece4', accent: '#ffd166' },
  },
  {
    id: 'aiko', name: 'Aiko', gender: 'female', hairstyle: 'ponytail',
    skinTone: '#ffe3cf', hairColor: '#9a6b4f', hairShade: '#7d5340', eyeColor: '#6b4a35',
    shirtColor: '#ffd9a0', accentColor: '#2ec4b6', bgFrom: '#fff0d9', bgTo: '#ffdfae',
    card: { primary: '#c98a4b', dark: '#8f5c2c', light: '#ffe2b8', accent: '#2ec4b6' },
  },
  {
    id: 'kai', name: 'Kai', gender: 'male', hairstyle: 'spiky',
    skinTone: '#f6d3b3', hairColor: '#3d4a63', hairShade: '#2b3549', eyeColor: '#3d6bb3',
    shirtColor: '#5c7fa8', accentColor: '#ffd166', bgFrom: '#dde7f2', bgTo: '#bccfe4',
    card: { primary: '#46536e', dark: '#2b3549', light: '#c3cde0', accent: '#ffd166' },
  },
  {
    id: 'ren', name: 'Ren', gender: 'male', hairstyle: 'messy',
    skinTone: '#ffe3cf', hairColor: '#f0c96a', hairShade: '#d4a943', eyeColor: '#4d8a4d',
    shirtColor: '#cfe6b8', accentColor: '#ff6b6b', bgFrom: '#f3f7dd', bgTo: '#e0eebc',
    card: { primary: '#c8a23f', dark: '#8c6f26', light: '#f2e3b8', accent: '#ff6b6b' },
  },
  {
    id: 'sora', name: 'Sora', gender: 'male', hairstyle: 'undercut',
    skinTone: '#e8b98d', hairColor: '#6b5340', hairShade: '#544031', eyeColor: '#41586e',
    shirtColor: '#a8bfd4', accentColor: '#2ec4b6', bgFrom: '#e6eef5', bgTo: '#c9dcea',
    card: { primary: '#5d7d99', dark: '#3c576e', light: '#cfe0ec', accent: '#2ec4b6' },
  },
  {
    id: 'taro', name: 'Taro', gender: 'male', hairstyle: 'curly',
    skinTone: '#c98a5b', hairColor: '#33302e', hairShade: '#211f1e', eyeColor: '#4a3527',
    shirtColor: '#f2b880', accentColor: '#ffd166', bgFrom: '#f7e8d8', bgTo: '#eccfae',
    card: { primary: '#d0603c', dark: '#98371f', light: '#f6cebd', accent: '#ffd166' },
  },
];

export function getAvatar(id: string): AvatarDef {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
}
