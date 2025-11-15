# Context Document for Frontend AI Assistant

## Overview

This document provides essential context and constraints for any AI system assisting in the development of the **GraphLab Frontend**.
The goal is to ensure coherence, maintainability, and adherence to the project's architectural and design principles.

The frontend must be implemented using **Next.js** and **React**, following industry best practices for component organization, rendering, fetching, and state management.

---

## Core Technologies and Constraints

### Next.js & React Best Practices

The application must follow:
- Component-driven architecture.
- Clean separation of UI, logic, and side effects.
- Proper use of server/client components according to Next.js 14 standards.
- File-system routing conventions from Next.js.
- Strict TypeScript usage.
- Avoidance of anti-patterns such as deeply nested prop drilling, unnecessary global state, or untyped API models.

### Shadcn UI

All UI components must use **shadcn/ui** styles and atoms.
Every available component must be imported from:

```
~/front/components
```

No external UI library should be mixed with shadcn without justification.

### React Flow

The application uses **React Flow** as its graph visualization engine.
All graph-related interactions should use React Flow nodes, edges, event handlers, and provider patterns.

### Axios

All HTTP communication must be implemented using **Axios**, following:

- Dedicated API service layer.
- Consistent handling of errors, interceptors, and base URL configuration.
- Clear typing for requests and responses.

---

## Project Documentation Dependencies

All frontend components, logic, and flows **must be grounded** in the project's core documentation:

### Requirements Specification

Located at:

```
~/docs/requirements.md
```

This file contains:
- Requisitos funcionais
- Requisitos não funcionais
- Regras de negócio

These must be respected when implementing features, views, pages, or states.

### Data Structure Specification

Located at:

```
~/docs/data_structure.md
```

This file defines:
- Estrutura visual (React Flow)
- Estrutura lógica (grafo interno)
- Estrutura de animação
- Modelos de entrada/saída da API
- Representação interna do backend

Any code generated must align strictly with these models.

---

## Guiding Principles for the AI

Although this document does not contain tasks or steps to execute, any AI generating frontend components must inherently follow these principles:

### Componentization

- All UI logic must be decomposed into reusable components.
- Every component should exist under:

```
~/front/components
```

### Style & Theming

- All styling must rely exclusively on shadcn/ui tokens, classes, and conventions.
- Tailwind must be used only in ways compatible with shadcn's patterns.

### API Access Patterns

- Axios must be used via a shared API utility.
- Requests must match exactly the JSON formats defined in `data_structure.md`.

### React Flow Integration

- Node/edge models must mirror the logical graph models.
- Hooks like `useReactFlow`, `useEdgesState`, `useNodesState` must be standard.
- Graph transformations must follow the conversion patterns documented.

---

## Purpose of This Document

This document exists to serve as a **foundation** for any AI assistant that will:

- Generate components
- Scaffold pages
- Implement graph interactions
- Produce API integration code
- Create UI flows such as dialogs, sidebars, and algorithm controls

It ensures that all generated code:

- Is consistent
- Aligns with project constraints
- Follows best engineering practices
- Matches project documentation
- Uses the correct libraries and directories
- Adheres to React and Next.js guidelines

---

## Final Notes

This file must accompany the requirements and data structure documents.
Any AI system assisting in development must treat these three documents as the **canonical source of truth** for the project.

No feature, UI component, or API integration should be generated without validating against:

- `requirements.md`
- `data_structure.md`
- This context document
