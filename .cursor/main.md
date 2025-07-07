# Generador de Menú Semanal - Documentación del MVP

## Descripción

Esta aplicación web tiene como objetivo principal simplificar la planificación de comidas semanales, ofreciendo al usuario un menú personalizado en base a sus necesidades alimenticias, preferencias personales y objetivos nutricionales. Además, generará una lista de compras asociada al menú validado por el usuario, asegurando que cuente con todos los ingredientes necesarios.

---

## Objetivos

### MVP (v1)

- Simplificar la planificación de comidas semanales.
- Asegurar que el usuario recuerde y compre todo lo necesario para las recetas.

### Versión 3

- Ahorro económico en la compra de alimentos.

---

## Funcionalidades

### Ámbitos de las funcionalidades

Cada funcionalidad de la app pertenece a un determinado *ámbito*, que define cuándo y dónde se aplica dentro de la experiencia del usuario:

- **Perfil**: Funcionalidades que el usuario configura una vez (o de forma poco frecuente) y se aplican a todos los menús que genere. Son parte de la configuración de su cuenta o preferencias generales.
- **Menú**: Funcionalidades que el usuario define cada vez que genera un nuevo menú. Están ligadas a ese menú específico y pueden cambiar de una generación a otra.
- **Cuenta**: Funcionalidades que no dependen del menú ni del perfil, sino que son transversales a toda la experiencia, como recordatorios o notificaciones generales.

| Funcionalidad                                            | Ámbito | MVP (v1) | Versión 2 | Versión 3 |
| -------------------------------------------------------- | ------ | -------- | --------- | --------- |
| Restricciones alimenticias                               | Perfil | ✅        |           |           |
| Preferencias personales                                  | Perfil | ✅        |           |           |
| Restricción calórica                                     | Menú   | ✅        |           |           |
| Validación del menú                                      | Menú   | ✅        |           |           |
| Aprovechamiento de ingredientes disponibles              | Menú   |          | ✅         |           |
| Variedad nutricional equilibrada                         | Menú   |          | ✅         |           |
| Compatibilidad con meal prep                             | Menú   |          | ✅         |           |
| Duración de almacenamiento de recetas                    | Menú   |          | ✅         |           |
| Selección de nivel de dificultad y tiempo de preparación | Menú   |          | ✅         |           |
| Historial de menús y recetas favoritas                   | Perfil |          | ✅         |           |
| Notificaciones o recordatorios                           | Cuenta |          | ✅         |           |
| Presupuesto semanal                                      | Menú   |          |           | ✅         |
| Recetas con porciones variables                          | Menú   |          |           | ✅         |
| Exportar o imprimir menú y lista de compras              | Menú   |          |           | ✅         |

### MVP (v1)

- **Restricciones alimenticias** `[Perfil]`: El usuario puede configurar restricciones alimenticias a nivel perfil, lo que impactará en todos los menús generados. La selección debe ser un multiselect de opciones preestablecidas en la app como Vegetariano, Celíaco, Bajo en sodio, Sin azúcar, Vegano, Keto, etc.

- **Preferencias personales** `[Perfil]`: El usuario puede excluir ingredientes, recetas o estilos de cocina que no sean de su agrado. Esto permite mayor personalización y adherencia al menú sugerido.

- **Restricción calórica** `[Menú]`: El usuario puede establecer un máximo de calorías diarias, y la app generará un menú que respete este límite.

- **Validación del menú** `[Menú]`: Antes de generar la lista de compras, la app mostrará el menú completo al usuario para que pueda revisarlo, hacer ajustes o confirmar su aprobación.

### Versión 2

- **Aprovechamiento de ingredientes disponibles** `[Menú]`: El usuario podrá ingresar (por texto o audio) los ingredientes que ya tiene en casa, y la app los priorizará en la selección de recetas.

- **Variedad nutricional equilibrada** `[Menú]`: La app considerará la inclusión de diferentes grupos alimenticios (proteínas, vegetales, carbohidratos) para asegurar una dieta variada y balanceada.

- **Compatibilidad con meal prep** `[Menú]`: Las recetas sugeridas podrán incluir etiquetas que indiquen si son aptas para preparar con anticipación y conservar para varios días.

- **Duración de almacenamiento de recetas** `[Menú]`: Las recetas mostrarán recomendaciones sobre su modo de conservación (freezer, refrigerador, consumo inmediato).

- **Selección de nivel de dificultad y tiempo de preparación** `[Menú]`: El usuario podrá filtrar recetas según su experiencia en la cocina y el tiempo que dispone para cocinar.

- **Historial de menús y recetas favoritas** `[Perfil]`: El usuario podrá acceder a menús anteriores y marcar recetas como favoritas para reutilizarlas fácilmente.

- **Notificaciones o recordatorios** `[Cuenta]`: La app podrá enviar alertas diarias para recordar al usuario qué comida tiene planificada o si necesita empezar a prepararla con antelación.

### Versión 3

- **Presupuesto semanal** `[Menú]`: El usuario podrá definir un límite de gasto, y la app generará un menú y lista de compras que no lo supere.

- **Recetas con porciones variables** `[Menú]`: Las recetas permitirán ajustar las cantidades según el número de personas, actualizando los ingredientes en consecuencia.

- **Exportar o imprimir menú y lista de compras** `[Menú]`: El usuario podrá descargar o imprimir su menú semanal y la lista de compras correspondiente.

---

## Cuenta del usuario

La cuenta del usuario es el espacio donde se centralizan sus datos personales y preferencias generales. Desde aquí, el usuario puede administrar configuraciones persistentes que impactan en la experiencia general con la app.

### Datos personales

- **Nombre**: Campo de texto.
- **Apellido**: Campo de texto.
- **Correo electrónico**: Campo obligatorio para registro y recuperación de cuenta.
- **Teléfono**: Campo opcional para notificaciones.

### Preferencias generales

- **Desea recibir notificaciones**: Switch general para activar o desactivar todas las notificaciones.

### Sección Notificaciones

El usuario podrá elegir cómo quiere recibir notificaciones. Cada tipo es configurable mediante un switch:

- **Notificaciones por correo electrónico**: Switch on/off.
- **Notificaciones por teléfono (SMS o WhatsApp)**: Switch on/off.
- **Notificaciones in-app**: Switch on/off.
- **Zona horaria o franja horaria preferida para notificaciones**.
- **Idioma preferido**.

### Sección Notificaciones

- La autenticación será únicamente a traves de plataformas: Google, Meta, Apple

### Posibles futuras configuraciones

- **Integración con calendario (Google, Outlook, etc)** para programar recordatorios de comida o compras.
- **Contraseña**: Soporte para creación de cuentas con email y password, incluyendo password reset

##



## Flujo de usuario

El flujo de usuario está diseñado para facilitar una incorporación progresiva e intuitiva, asegurando que cada paso construya una experiencia personalizada desde el inicio.

### 1. Registro / Autenticación

- El usuario se registra o inicia sesión mediante una plataforma externa: Google, Meta o Apple.

### 2. Onboarding - Paso 1: Datos personales

- Se le solicita al usuario completar su perfil con los siguientes campos:
  - Nombre
  - Apellido
  - Correo electrónico
  - Teléfono (opcional)

### 3. Onboarding - Paso 2: Configuración del perfil

- Se solicita también la cantidad de porciones deseadas por comida, para poder ajustar automáticamente las cantidades de ingredientes en el menú generado.

- Se invita al usuario a definir sus configuraciones de perfil que afectarán todos los menús:

  - Restricciones alimenticias (multiselect)
  - Preferencias personales (ingredientes o recetas a excluir)

### 4. Acceso a la app y creación del primer menú

- El usuario accede a la pantalla principal donde se le ofrece crear su primer menú personalizado.
- Define opciones específicas del menú:
  - Días del menú
  - Comidas por día (almuerzo, cena, etc.)
  - Calorías máximas por día
  - Cantidad de porciones
- Se genera una propuesta de menú que debe ser validada por el usuario.

### 5. Generación de lista de compras

- Una vez validado el menú, se genera automáticamente la lista de compras.

### 6. Notificaciones

- Si el usuario habilitó las notificaciones, podrá recibir recordatorios según su configuración de cuenta.

La cuenta del usuario es el espacio donde se centralizan sus datos personales y preferencias generales. Desde aquí, el usuario puede administrar configuraciones persistentes que impactan en la experiencia general con la app.





## Generación de recetas por inteligencia artificial

La aplicación no cuenta con un repositorio fijo de recetas. En su lugar, las recetas son generadas dinámicamente por un agente de inteligencia artificial cada vez que el usuario solicita la creación de un nuevo menú. El flujo es el siguiente:

1. El usuario solicita un nuevo menú.
2. La aplicación recopila los parámetros configurados:
   - Días y comidas por día
   - Calorías máximas
   - Cantidad de porciones
   - Restricciones alimenticias
   - Preferencias personales
3. Se envía un prompt al agente de IA con esta información.
4. El agente responde con un conjunto de recetas estructuradas.
5. El usuario visualiza y valida las recetas propuestas.
6. Las recetas validadas se guardan como parte del menú y se almacenan en el historial del usuario para futura referencia.

Esta arquitectura permite flexibilidad, personalización total y evita la necesidad de una base de datos inicial de recetas estáticas.

### Decisión de diseño: generación en un único paso

Se consideraron dos enfoques posibles para la generación de menús y recetas con IA:

#### Opción A: Un único prompt que genera todo (menú + recetas + ingredientes)

- **Ventajas**:
  - Menor cantidad de llamadas a la API (menor costo).
  - Menor complejidad de implementación.
  - Mayor coherencia entre el menú y sus recetas.
  - Mejor experiencia de usuario (flujo directo y completo).
- **Desventajas**:
  - Tiempo de respuesta algo mayor.
  - Si el usuario rechaza el menú, se descarta todo.

#### Opción B: Flujo dividido en dos pasos (primero menú, luego recetas)

- **Ventajas**:
  - Tiempo de respuesta inicial más rápido.
  - Posibilidad de edición del menú previo a la generación de recetas.
- **Desventajas**:
  - Mayor costo por tokens y llamadas.
  - Riesgo de inconsistencia entre menú y recetas generadas.
  - Mayor complejidad técnica en la app.

**Conclusión**: Para el MVP, se opta por la Opción A (generación completa en un único prompt), priorizando eficiencia de costos, simplicidad técnica y coherencia en la experiencia de usuario.

Esta arquitectura permite flexibilidad, personalización total y evita la necesidad de una base de datos inicial de recetas estáticas.





## Prompt

Este es el prompt detallado que se envía al agente de inteligencia artificial para generar el menú semanal completo, incluyendo recetas e ingredientes, basado en las preferencias del usuario y los parámetros seleccionados para el menú.

````
Quiero que generes un plan de comidas personalizado para un usuario con las siguientes características de perfil y requerimientos de menú. Tu respuesta debe seguir una estructura estricta en formato JSON, como se indica más abajo.

---

### Datos del usuario:
- País: [Argentina]
- Restricciones alimenticias: [Vegano, Sin gluten]
- Exclusiones personales (ingredientes que NO deben aparecer en ninguna receta): [berenjena, mayonesa, brócoli]
- Preferencias personales (no excluyentes): [prefiere cocina mediterránea y recetas fáciles de preparar]
- Cantidad de porciones por comida: [2]

---

### Parámetros del menú a generar:
- Duración del menú: [5 días]
- Comidas por día: [almuerzo, cena]
- Calorías máximas por día: [1800]

---

### Instrucciones para la generación:

1. Todas las recetas deben cumplir con las restricciones alimenticias indicadas.
2. No uses ninguno de los ingredientes excluidos.
3. Tené en cuenta las preferencias personales para sugerir recetas acordes, sin que sean obligatorias.
4. Utilizá ingredientes y preparaciones comunes en el país del usuario (`Argentina`) y adaptá el vocabulario culinario según el contexto local (por ejemplo: usar “palta” en lugar de “aguacate”).
5. Las recetas deben ser realistas, posibles de hacer en casa, y con pasos claros y concisos.
6. Cada comida debe incluir: nombre de la receta, descripción, calorías por porción, tiempo de preparación, dificultad, pasos detallados e ingredientes con cantidades.
7. Calculá los ingredientes en base a la cantidad de porciones indicadas (ej.: 2 porciones por comida).
8. Además del menú, generá una lista de compras unificada, agrupando ingredientes repetidos en diferentes recetas. Sumá las cantidades totales necesarias por ingrediente.

---

### Formato de respuesta (JSON estructurado):

```json
{
  "menu": [
    {
      "day": "Lunes",
      "meals": [
        {
          "type": "almuerzo",
          "recipe": {
            "name": "Ensalada tibia de lentejas y verduras",
            "description": "Una ensalada rica en proteínas vegetales con vegetales asados.",
            "calories_per_serving": 450,
            "preparation_time": 25,
            "difficulty": "Fácil",
            "freezable": true,
            "instructions": [
              "Lavar y cortar los vegetales.",
              "Asar al horno durante 20 minutos.",
              "Mezclar con lentejas cocidas y aliño."
            ],
            "ingredients": [
              { "name": "lentejas cocidas", "quantity": 200, "unit": "g" },
              { "name": "zanahoria", "quantity": 1, "unit": "unidad" },
              { "name": "pimiento rojo", "quantity": 1, "unit": "unidad" }
            ]
          }
        },
        {
          "type": "cena",
          "recipe": { ... }
        }
      ]
    },
    ...
  ],
  "summary": {
    "total_days": 5,
    "meals_per_day": 2,
    "total_calories_estimated": 8700
  },
  "shopping_list": [
    { "name": "lentejas cocidas", "total_quantity": 800, "unit": "g" },
    { "name": "zanahoria", "total_quantity": 5, "unit": "unidad" }
  ]
}
````

````







## Estructura de datos

La siguiente estructura representa las principales entidades del sistema y sus relaciones, considerando el enfoque de generación dinámica de recetas por IA y personalización por usuario.

### User

```json
User {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  country: string,
  auth_method: string, // "google", "meta", "apple"
  exclusion_preferences: string[],
  general_preferences: string,
  created_at: Date
}
````

### DietaryRestriction

```json
DietaryRestriction {
  id: string,
  name: string,       // e.g., "Vegan"
  slug: string        // e.g., "vegan"
}
```

### UserDietaryRestriction

```json
UserDietaryRestriction {
  user_id: string,
  restriction_id: string
}
```

### UserSettings

```json
UserSettings {
  id: string,
  user_id: string,
  allow_notifications: boolean,
  notify_by_email: boolean,
  notify_by_phone: boolean,
  notify_in_app: boolean,
  timezone: string,
  language: string
}
```

### Menu

```json
Menu {
  id: string,
  user_id: string,
  created_at: Date,
  start_date: Date,
  days: number,
  meals_per_day: string[],
  max_calories_per_day: number,
  servings: number,
  status: string // "pending", "active", "finished", "canceled"
}
```

### Recipe

```json
Recipe {
  id: string,
  user_id: string,
  menu_id: string,
  source: "generated",
  name: string,
  description: string,
  calories_per_serving: number,
  default_servings: number,
  preparation_time: number,
  difficulty: string,
  instructions: string[],
  freezable: boolean,
  favorite: boolean,
  created_at: Date
}
```

### ShoppingList

```json
ShoppingList {
  id: string,
  menu_id: string,
  items: ShoppingListItem[],
  generated_at: Date
}
```

### ShoppingListItem

```json
ShoppingListItem {
  name: string,
  quantity: number,
  unit: string,
  checked: boolean
}
```

```


```
