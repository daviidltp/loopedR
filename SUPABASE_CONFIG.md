# Configuración de Supabase para Autenticación con Spotify

## Variables de Entorno Necesarias

Asegúrate de tener las siguientes variables de entorno configuradas en tu archivo `.env`:

```
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
```

## Configuración de OAuth en Supabase

### 1. Configurar Spotify Provider

En tu proyecto de Supabase:

1. Ve a **Authentication > Providers**
2. Activa **Spotify**
3. Configura los siguientes campos:
   - **Client ID**: Tu Spotify App Client ID
   - **Client Secret**: Tu Spotify App Client Secret
   - **Redirect URL**: Las URLs que configuraste en tu app de Spotify

### 2. URLs de Redirección

Las URLs de redirección que debes configurar en tu Spotify App:

- **Para desarrollo con Expo**: `exp://192.168.1.60:8081`
- **Para producción**: `loopedr://callback`

### 3. Configurar Redirect URLs en Supabase

En **Authentication > URL Configuration**, añade las siguientes URLs:

```
exp://192.168.1.60:8081
loopedr://callback
```

### 4. Scopes de Spotify

Los scopes que se solicitan automáticamente:
- `user-read-email`
- `user-top-read`
- `user-read-recently-played`
- `playlist-read-private`
- `playlist-read-collaborative`

## Cómo Funciona Ahora

1. El usuario presiona "Conectar con Spotify"
2. Se abre el navegador con la autenticación de Spotify via Supabase
3. El usuario autoriza la aplicación
4. Supabase maneja el intercambio de tokens automáticamente
5. El usuario es redirigido de vuelta a la app
6. Se obtiene el perfil del usuario y se guarda en el contexto
7. Se navega a CreateProfile

## Ventajas de Usar Supabase

- ✅ Manejo automático de tokens
- ✅ Renovación automática de tokens
- ✅ Persistencia de sesión
- ✅ Seguridad mejorada
- ✅ Integración con base de datos
- ✅ Logs de autenticación 