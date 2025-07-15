# 🚨 CONFIGURACIÓN URGENTE REQUERIDA

## El navegador no se abre porque faltan las variables de entorno

Necesitas crear un archivo `.env.local` en la raíz del proyecto con:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-supabase-anon-key
```

## Cómo obtener estos valores:

1. **Ve a tu proyecto de Supabase** (https://app.supabase.com)
2. **Settings > API**
3. **Copia los valores**:
   - `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon public` → `EXPO_PUBLIC_SUPABASE_KEY`

## Ejemplo de archivo `.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5MTk2ODAsImV4cCI6MjAxNTQ5NTY4MH0.example-key
```

## Después de crear el archivo:

1. **Reinicia el servidor**: `npm start` o `expo start`
2. **Prueba el botón de Spotify** de nuevo
3. **Debería abrirse el navegador** con la autenticación

## Si sigues teniendo problemas:

- Verifica que el archivo `.env.local` esté en la raíz del proyecto
- Asegúrate de que no hay espacios extra en las variables
- Reinicia completamente el servidor de desarrollo 