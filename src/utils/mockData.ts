export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  isPublic: boolean; // true = público, false = privado
}

export interface UserRelation {
  followerId: string;
  followingId: string;
}

// Usuarios simulados
export const mockUsers: User[] = [
  {
    id: 'q888kbwstnr1b5p7j1lv32vr4',
    username: 'david',
    displayName: 'David Lopez',
    bio: 'CEO de looped, programador, diseñador, artista, etc.',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1578802191678177281/BlJ-NtBl_400x400.jpg',
    isVerified: true,
    isPublic: false, // Perfil privado para mostrar el candado
  },
  {
    id: '2',
    username: 'pedrodquevedo',
    displayName: 'Quevedo',
    bio: 'Escucha mi último disco "Buenas noches" ya disponible en todas las plataformas.',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1851626170543972353/lmBVAsTV_400x400.jpg',
    isVerified: true,
    isPublic: true,
  },
  {
    id: '3',
    username: 'alex',
    displayName: 'Alex Barranco',
    bio: 'CEO de looped, programador, diseñador, artista, etc.',
    avatarUrl: 'https://unavatar.io/x/abepe1010',
    isVerified: true,
    isPublic: false,
  },
  {
    id: '4',
    username: 'dj_beats',
    displayName: 'DJ Beats',
    bio: '',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    isVerified: false,
    isPublic: false,
  },
  {
    id: '5',
    username: 'indie_vibes',
    displayName: 'Indie Vibes',
    bio: '',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    isVerified: false,
    isPublic: true,
  },
];

// Relaciones de seguimiento simuladas
export const mockUserRelations: UserRelation[] = [
  { followerId: '1', followingId: '2' }, // q888kbwstnr1b5p7j1lv32vr4
  { followerId: '2', followingId: '3' },
  
  // musiclover23 sigue a rockstar_girl y dj_beats
  { followerId: '2', followingId: '3' },
  { followerId: '2', followingId: '4' },
  
  // rockstar_girl sigue a dj_beats e indie_vibes
  { followerId: '3', followingId: '4' },
  { followerId: '3', followingId: '5' },
  
  // dj_beats sigue a indie_vibes
  { followerId: '4', followingId: '5' },
  
  // indie_vibes sigue a musiclover23
  { followerId: '5', followingId: '2' },
  
  // David (@david) no sigue a nadie - sin relaciones
];

// Usuario actual simulado
export const currentUser: User = mockUsers[0]; // David

// Funciones helper
export const getUserFollowing = (userId: string): User[] => {
  const followingIds = mockUserRelations
    .filter(relation => relation.followerId === userId)
    .map(relation => relation.followingId);
  
  return mockUsers.filter(user => followingIds.includes(user.id));
};

export const getUserFollowers = (userId: string): User[] => {
  const followerIds = mockUserRelations
    .filter(relation => relation.followingId === userId)
    .map(relation => relation.followerId);
  
  return mockUsers.filter(user => followerIds.includes(user.id));
};

export const isUserFollowing = (followerId: string, followingId: string): boolean => {
  return mockUserRelations.some(
    relation => relation.followerId === followerId && relation.followingId === followingId
  );
};

export const hasAnyFollowing = (userId: string): boolean => {
  return getUserFollowing(userId).length > 0;
}; 