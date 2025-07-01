# Cómo Usar el Sistema de Estilos de Texto

## Importaciones

```typescript
// Importar el componente AppText
import { AppText } from '../ui/Text/AppText';

// O importar desde ui (si está exportado)
import { AppText } from '../ui';

// Importar estilos directamente (para uso con Text de React Native)
import { textStyles, getTextStyle } from '../../constants/TextStyles';
```

## Usando AppText (Recomendado)

```tsx
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../ui';

const ExampleComponent = () => {
  return (
    <View>
      {/* Títulos */}
      <AppText variant="h1">Título Principal</AppText>
      <AppText variant="h2">Subtítulo</AppText>
      
      {/* Texto de cuerpo */}
      <AppText variant="body">
        Este es el texto principal del componente usando Poppins.
      </AppText>
      
      {/* Texto con color personalizado */}
      <AppText variant="body" color="#FF6B6B">
        Texto con color personalizado
      </AppText>
      
      {/* Botones */}
      <AppText variant="button">TEXTO DE BOTÓN</AppText>
      
      {/* Texto pequeño/caption */}
      <AppText variant="caption">
        Texto pequeño o descripción adicional
      </AppText>
      
      {/* Texto de error */}
      <AppText variant="error">
        Mensaje de error
      </AppText>
      
      {/* Texto de éxito */}
      <AppText variant="success">
        Operación exitosa
      </AppText>
      
      {/* Estilos combinados */}
      <AppText 
        variant="body" 
        style={{ textAlign: 'center', marginTop: 20 }}
      >
        Texto centrado con margin personalizado
      </AppText>
    </View>
  );
};
```

## Usando Text de React Native con estilos directos

```tsx
import React from 'react';
import { Text, View } from 'react-native';
import { textStyles, getTextStyle } from '../../constants/TextStyles';

const ExampleWithDirectStyles = () => {
  return (
    <View>
      {/* Usar estilos predefinidos */}
      <Text style={textStyles.h1}>Título con estilo directo</Text>
      <Text style={textStyles.body}>Texto de cuerpo</Text>
      
      {/* Usar helper con color personalizado */}
      <Text style={getTextStyle('body', '#FF6B6B')}>
        Texto con color personalizado
      </Text>
      
      {/* Combinar con estilos adicionales */}
      <Text style={[textStyles.body, { textAlign: 'center' }]}>
        Texto centrado
      </Text>
    </View>
  );
};
```

## Estilos Disponibles

### Títulos
- `h1` - Título principal (32px, Bold)
- `h2` - Subtítulo grande (28px, SemiBold)
- `h3` - Subtítulo mediano (24px, SemiBold)
- `h4` - Subtítulo pequeño (20px, Medium)
- `h5` - Encabezado pequeño (18px, Medium)
- `h6` - Encabezado mínimo (16px, Medium)

### Texto de Cuerpo
- `bodyLarge` - Texto grande (18px, Regular)
- `body` - Texto normal (16px, Regular)
- `bodySmall` - Texto pequeño (14px, Regular)

### Interfaz
- `button` - Texto de botón (16px, SemiBold)
- `buttonSmall` - Botón pequeño (14px, Medium)
- `label` - Etiquetas (14px, Medium)
- `labelSmall` - Etiquetas pequeñas (12px, Medium)

### Especiales
- `display` - Texto muy grande (48px, ExtraBold)
- `displaySmall` - Display pequeño (36px, Bold)
- `caption` - Texto descriptivo (12px, Regular)
- `overline` - Texto en mayúsculas (10px, Medium)
- `link` - Enlaces (16px, Medium, underline)
- `linkSmall` - Enlaces pequeños (14px, Medium, underline)

### Estados
- `error` - Mensajes de error (14px, Medium, rojo)
- `success` - Mensajes de éxito (14px, Medium, verde)
- `placeholder` - Texto placeholder (16px, Regular, gris)

## Ventajas del Sistema

1. **Consistencia**: Todos los textos usan las mismas fuentes y estilos
2. **Mantenibilidad**: Cambiar un estilo se refleja en toda la app
3. **Type Safety**: TypeScript te ayuda con autocompletado
4. **Flexibilidad**: Puedes combinar estilos base con personalizaciones
5. **Performance**: Los estilos se crean una sola vez con StyleSheet.create() 