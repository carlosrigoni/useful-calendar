# Architecture

This project follows a feature-first structure.

Server-side business logic should not live directly inside React components.
Validation schemas should be colocated with the feature.
External integrations should be wrapped in services.
Database access should be isolated from UI components.
