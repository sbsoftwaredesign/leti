---
title: "Instrucciones de Agentes IA"
subtitle: "Agentes de flujo de trabajo para la gestión de documentos"
date: "2026-03-26"
category: "guide"
status: "final"
order: 1
locale: "es"
description: "Instrucciones para los agentes de IA que asisten con la escritura, traducción y mantenimiento de la aplicación."
---

# Instrucciones de Agentes IA

_Agentes de flujo de trabajo para la gestión de documentos_

Este proyecto utiliza tres agentes de IA especializados para gestionar documentos profesionales de Leticia Cáceres. Cada agente tiene un rol definido, un conjunto de reglas y un flujo de trabajo.

## Agente @writer

El agente Writer mejora y crea documentos profesionales. Opera sobre los archivos fuente en `src/content/projects/` y sigue estrictas convenciones de inglés australiano/británico.

### Responsabilidades

- Mejorar documentos existentes y redactar nuevo contenido
- Revisar respuestas de solicitudes para programas de cine
- Verificar conteos de palabras y páginas contra los límites establecidos
- Aplicar la lista de control de calidad antes de finalizar cualquier documento

### Reglas de Escritura

Todo el contenido debe usar inglés australiano/británico: colour, programme, organise, centre, defence, travelling. Nunca usar ortografía americana.

Nunca usar guiones largos o guiones medios en la prosa. Usar comas, punto y coma, dos puntos, paréntesis o puntos. Los rangos de fechas usan "to" (por ejemplo, "2012 to 2015").

### Tono

Primera persona, profesional pero cálido. Voz activa. Títulos de películas en cursiva. Mostrar, no decir: hacer referencia a créditos y resultados específicos. Cuantificar logros.

### Lista de Control de Calidad

Antes de finalizar cualquier documento, el Writer verifica:

1. Sin guiones largos o medios en la prosa
2. Toda la ortografía es inglés australiano/británico
3. Los conteos de palabras y páginas están dentro de los límites
4. Voz activa en todo el documento
5. Títulos de películas en cursiva
6. Sin redundancia temática entre secciones

## Agente @translator

El agente Translator mantiene las versiones en español argentino (es-AR) de todos los documentos.

### Responsabilidades

- Traducir contenido nuevo o actualizado al español argentino
- Mantener paridad de traducción entre versiones en inglés y español
- Preservar el formato markdown, la estructura del frontmatter y el diseño
- Asegurar precisión cultural con las convenciones argentinas

### Reglas de Traducción

- Títulos de películas: mantener títulos originales en inglés y cursiva
- Nombres de premios: mantener en inglés (Helpmann, AACTA, LOGIE)
- Nombres de compañías y programas: mantener en inglés
- Nombres de personajes en sinopsis: mantener en negritas mayúsculas en inglés
- La regla de prohibición de guiones aplica igualmente al contenido en español
- Los archivos en español deben incluir `locale: "es"` en el frontmatter

## Agente @app

El agente App mantiene la aplicación web, gestiona builds, testing, seguridad y despliegue.

### Responsabilidades

- Construir el sitio (`pnpm build`) y generar exportaciones (`pnpm exports`)
- Ejecutar tests (`pnpm test:run`) y asegurar que todos pasen antes de commitear
- Auditar dependencias (`pnpm audit`) y corregir todas las vulnerabilidades
- Hacer push a ambos remotos: GitHub y Gitea
- Actualizar el log de progreso (PROGRESS.md) después de cambios significativos
- Mantener las instrucciones de IA actualizadas cuando la arquitectura cambie

### Lista de Control Pre-Commit

1. El build tiene éxito con el conteo de páginas esperado
2. Todos los tests pasan
3. Cero vulnerabilidades en la auditoría
4. Exportaciones generadas exitosamente
5. Push realizado a ambos remotos: `origin` (GitHub) y `gitea` (Woodpecker CI)

### Remotos Git

| Remoto | Propósito                                        |
| ------ | ------------------------------------------------ |
| origin | Repositorio en GitHub                            |
| gitea  | Servidor Gitea con Woodpecker CI para despliegue |

### Comandos Clave

| Comando           | Propósito                            |
| ----------------- | ------------------------------------ |
| pnpm dev          | Servidor de desarrollo               |
| pnpm build        | Construir sitio estático             |
| pnpm exports      | Generar exportaciones markdown y PDF |
| pnpm test:run     | Ejecutar todos los tests             |
| pnpm audit        | Verificar vulnerabilidades           |
| pnpm lint:content | Validar ortografía y puntuación      |

## Flujo de Trabajo de Documentos

El flujo de trabajo estándar para actualizaciones de documentos:

1. **@writer** mejora o crea contenido en `src/content/projects/*.md`
2. **@translator** traduce a `src/content/projects/es/*.md`
3. **@app** construye, testea, genera exportaciones y hace push a ambos remotos

Los tres agentes siguen las reglas de escritura definidas en `.github/instructions/writing-rules.instructions.md` y las convenciones del proyecto en `.github/copilot-instructions.md`.
