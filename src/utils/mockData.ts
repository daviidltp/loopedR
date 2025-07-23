export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  isPublic: boolean; // true = público, false = privado
  followersCount: number;
  followingCount: number;
  followStatus: 'none' | 'pending' | 'accepted';
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
    followersCount: 0,
    followingCount: 0,
    followStatus: 'none',
  },
  {
    id: '2',
    username: 'pedrodquevedo',
    displayName: 'Quevedo',
    bio: 'Escucha mi último disco "Buenas noches" ya disponible en todas las plataformas.',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1851626170543972353/lmBVAsTV_400x400.jpg',
    isVerified: true,
    isPublic: true,
    followersCount: 0,
    followingCount: 0,
    followStatus: 'none',
  },
  {
    id: '3',
    username: 'alex',
    displayName: 'Alex Barranco',
    bio: 'CEO de looped. Estudiante en la UPV. Me gustan las matemáticas, la programación y el diseño. ',
    avatarUrl: 'https://unavatar.io/x/abepe1010',
    isVerified: true,
    isPublic: false,
    followersCount: 0,
    followingCount: 0,
    followStatus: 'none',
  },
  {
    id: '4',
    username: 'jjmartos',
    displayName: 'Jose Javier',
    bio: '',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1360924630719098880/rC6A3VyY_400x400.jpg',
    isVerified: false,
    isPublic: false,
    followersCount: 0,
    followingCount: 0,
    followStatus: 'none',
  },
  {
    id: '5',
    username: 'benitoanotniomartinezocasioparera',
    displayName: 'Benito Antonio Martinez Ocasio Parera',
    bio: '',
    avatarUrl: 'https://pbs.twimg.com/profile_images/1492654234122207234/su1Dtj9B_400x400.jpg',
    isVerified: false,
    isPublic: true,
    followersCount: 0,
    followingCount: 0,
    followStatus: 'none',
  },
];

// Relaciones de seguimiento simuladas
export const mockUserRelations: UserRelation[] = [
  { followerId: 'q888kbwstnr1b5p7j1lv32vr4', followingId: '2' }, // q888kbwstnr1b5p7j1lv32vr4
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

// Nuevos tipos para posts, comentarios y notificaciones
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  timestamp: number;
}

export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment';
  fromUserId: string;
  toUserId: string;
  postId: string;
  commentId?: string;
  timestamp: number;
}

// Tipos de post discriminados
export type Top3SongsPost = {
  id: string;
  type: 'top-3-songs';
  user: User;
  timestamp: number;
  topSongs: Array<{
    position: number;
    title: string;
    artist: string;
    plays: string;
    albumCover: string;
  }>;
  description: string;
};

export type WelcomePost = {
  id: string;
  type: 'welcome';
  user: User;
  timestamp: number;
  topSongs: Array<{
    position: number;
    title: string;
    artist: string;
    plays: string;
    albumCover: string;
  }>;
  description: string;
};

export type Post = Top3SongsPost | WelcomePost; // | OtroTipoDePostEnElFuturo

// Posts mock
export const mockPosts: Post[] = [
  {
    id: 'top3-1',
    type: 'top-3-songs',
    user: mockUsers[1], // pedrodquevedo
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
    topSongs: [
      {
        position: 1,
 
        title: 'Polaris - Remix',
        artist: 'SAIKO, Quevedo, Feid, Mora',
        plays: '950K',
        albumCover: 'https://i.scdn.co/image/ab67616d00001e028f4a278cd5b5b2f65a0f87fd',
      },
      {
        position: 2,
        title: 'Sigo en la plaza',
        artist: 'GRECAS',
        plays: '1.2M',
        albumCover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ2PNj3qScKTD-_E3wXh3C0ZWno5yWM5U5MQ&s',
      },
      {
        position: 3,
        title: 'Let Her Go',
        artist: 'Passenger',
        plays: '800K',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273a7c10595167c713a2df0f187',
      },
    ],
    description: '@angel Mano vaya 3 canciones más duras no como las del puto anormal de @alex jajajajaj ',
  },
  {
    id: 'top3-2',
    type: 'top-3-songs',
    user: mockUsers[2], // pedrodquevedo
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
    topSongs: [
      {
        position: 1,

        title: 'BIRDS OF A FEATHER',
        artist: 'Billie Eilish',
        plays: '950K',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
      },
      {
        position: 2,
        title: 'God\'s Plan',
        artist: 'Drake',
        plays: '1.2M',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5',
      },
      {
        position: 3,
        title: 'Lacy',
        artist: 'Olivia Rodrigo',
        plays: '800K',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b2734063d624ebf8ff67bc3701ee',
      },
    ],
    description: 'Mis 3 canciones más escuchadas esta semana. Recién sacadas del vertedero.',
  },
  {
    id: 'top3-3',
    type: 'top-3-songs',
    user: mockUsers[0], // david
    timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1 hora atrás
    topSongs: [
      {
        position: 1,
        title: 'MAMICHULA',
        artist: 'Trueno, Nicki Nicole',
        plays: '2.1M',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273f4483d4440a89a2cab3b5141',
      },
      {
        position: 2,
        title: 'REINA',
        artist: 'Mora, SAIKO',
        plays: '500K', 
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273b8cc7d03ca3788f3ad7b71fd',
      },
      {
        position: 3,
        title: 'Me Porto Bonito',
        artist: 'Bad Bunny, Chencho Corleone',
        plays: '3.2M',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72',
      },
    ],
    description: 'wtf es este bucle bro',
  },
  {
    id: 'top3-4',
    type: 'welcome',
    user: mockUsers[3], // david
    timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1 hora atrás
    topSongs: [
      {
        position: 1,
        title: 'DESPECHÁ',
        artist: 'ROSALÍA',
        plays: '1.8M',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b2738f072024e0358fc5c62eba41',
      },
      {
        position: 2,
        title: 'Flowers',
        artist: 'Miley Cyrus',
        plays: '2.5M',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d',
      },
      {
        position: 3,
        title: 'As It Was',
        artist: 'Harry Styles',
        plays: '1.9M',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14',
      },
    ],
    description: 'Pues ya estamos por aquí!',
  },
];

// Comentarios mock
export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    content: 'Me encanta la dirección que está tomando looped!',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutos atrás
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    content: 'Esperando ansioso las novedades',
    timestamp: Date.now() - 1000 * 60 * 10, // 10 minutos atrás
  },
  {
    id: '3',
    postId: '2',
    userId: '4',
    content: 'Totalmente de acuerdo 🎶',
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hora atrás
  },
  {
    id: '4',
    postId: '2',
    userId: '5',
    content: 'La música es vida',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 minutos atrás
  },
];

// Likes mock
export const mockLikes: Like[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    timestamp: Date.now() - 1000 * 60 * 25, // 25 minutos atrás
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    timestamp: Date.now() - 1000 * 60 * 20, // 20 minutos atrás
  },
  {
    id: '3',
    postId: '2',
    userId: '4',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 horas atrás
  },
  {
    id: '4',
    postId: '2',
    userId: '5',
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 horas atrás
  },
  {
    id: '5',
    postId: '2',
    userId: '2',
    timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 horas atrás
  },
];

// Solicitudes de seguimiento mock
export const mockFollowRequests: FollowRequest[] = [
  {
    id: '1',
    fromUserId: '4',
    toUserId: 'q888kbwstnr1b5p7j1lv32vr4',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
  },
  {
    id: '2',
    fromUserId: '5',
    toUserId: 'q888kbwstnr1b5p7j1lv32vr4',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 día atrás
  },
  {
    id: '3',
    fromUserId: '2',
    toUserId: 'q888kbwstnr1b5p7j1lv32vr4',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 días atrás
  }, 
  {
    id: '4',
    fromUserId: '3',
    toUserId: 'q888kbwstnr1b5p7j1lv32vr4',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 días atrás
  },
];

// Notificaciones mock (generadas automáticamente desde likes y comentarios)
export const mockNotifications: Notification[] = [
  // Notificaciones de likes
  ...mockLikes
    .filter(like => like.postId === '1' || like.postId === '2') // Solo posts del usuario actual
    .map(like => ({
      id: `like_${like.id}`,
      type: 'like' as const,
      fromUserId: like.userId,
      toUserId: 'q888kbwstnr1b5p7j1lv32vr4',
      postId: like.postId,
      timestamp: like.timestamp,
    })),
  // Notificaciones de comentarios
  ...mockComments
    .filter(comment => comment.postId === '1' || comment.postId === '2') // Solo posts del usuario actual
    .map(comment => ({
      id: `comment_${comment.id}`,
      type: 'comment' as const,
      fromUserId: comment.userId,
      toUserId: 'q888kbwstnr1b5p7j1lv32vr4',
      postId: comment.postId,
      commentId: comment.id,
      timestamp: comment.timestamp,
    })),
];

// Funciones helper para notificaciones
export const getNotificationsByTimeRange = (notifications: Notification[], hours: number): Notification[] => {
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);
  return notifications.filter(notification => notification.timestamp >= cutoff);
};

export const getTodayNotifications = (): Notification[] => {
  return getNotificationsByTimeRange(mockNotifications, 24);
};

export const getWeekNotifications = (): Notification[] => {
  const today = getTodayNotifications();
  const week = getNotificationsByTimeRange(mockNotifications, 24 * 7);
  return week.filter(notification => !today.some(t => t.id === notification.id));
};

export const getOlderNotifications = (): Notification[] => {
  const week = getNotificationsByTimeRange(mockNotifications, 24 * 7);
  return mockNotifications.filter(notification => !week.some(w => w.id === notification.id));
};

export const getFollowRequestsForUser = (userId: string): FollowRequest[] => {
  return mockFollowRequests.filter(request => request.toUserId === userId);
};

export const getCommentById = (commentId: string): Comment | undefined => {
  return mockComments.find(comment => comment.id === commentId);
};

export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
}; 