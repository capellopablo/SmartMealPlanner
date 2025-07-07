# Smart Meal Planner

Este es un proyecto de planificador de comidas inteligente construido con Next.js. La aplicación permite a los usuarios obtener planes de alimentación personalizados basados en sus objetivos, preferencias y restricciones dietéticas.

## 📜 Descripción

La aplicación guía a los nuevos usuarios a través de un proceso de onboarding de varios pasos para recopilar información detallada, que incluye:

-   Información personal
-   Objetivos de salud (pérdida de peso, mantenimiento, etc.)
-   Preferencias alimenticias
-   Restricciones y alergias
-   Requerimientos calóricos

Con estos datos, el sistema genera un plan de comidas semanal o mensual adaptado a las necesidades específicas del usuario.

## 🚀 Stack Tecnológico

El proyecto está construido con un stack moderno y enfocado en la productividad y escalabilidad:

-   **Framework**: [Next.js](https://nextjs.org/) (con App Router)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [React](https://react.dev/)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes**: [shadcn/ui](https://ui.shadcn.com/)
-   **Gestor de Paquetes**: [pnpm](https://pnpm.io/)

## ⚙️ Instalación y Ejecución Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) y [pnpm](https://pnpm.io/installation).

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/smart-meal-planner.git
cd smart-meal-planner
```

### 2. Instalar Dependencias

Usa `pnpm` para instalar las dependencias del proyecto.

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y añade las variables de entorno necesarias. Puedes usar `.env.example` como plantilla si existe.

```bash
# .env.local
DATABASE_URL="tu-database-url"
NEXTAUTH_SECRET="tu-secret"
# ... otras variables
```

### 4. Ejecutar la Aplicación

Inicia el servidor de desarrollo de Next.js.

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Структура del Proyecto

La estructura del proyecto está diseñada para ser modular y escalable:

```
/app                # Rutas y páginas (App Router)
/components         # Componentes de React (UI y de lógica)
/modules            # Lógica de negocio principal (servicios, repositorios)
/shared             # Tipos y utilidades compartidas
/lib                # Funciones de utilidad
/hooks              # Hooks de React personalizados
/public             # Archivos estáticos
/styles             # Estilos globales
``` 