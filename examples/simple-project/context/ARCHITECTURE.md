# Architecture

This document describes the high-level architecture of the TaskFlow project.

Its purpose is to help contributors understand how the system is organized without reading the source code.

---

# ARCH-0001

## Title

Layered Application Architecture

## Objective

Organize the application into clear functional layers with well-defined responsibilities.

## Overview

TaskFlow follows a simple layered architecture.

Each layer has a single responsibility and communicates only with adjacent layers.

```text
┌──────────────────────┐
│      User Interface  │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│   Application Logic  │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│     Data Storage     │
└──────────────────────┘
```

---

## Components

### User Interface

Responsible for displaying information and receiving user input.

---

### Application Logic

Responsible for:

* Business rules
* Task management
* Validation
* Workflow coordination

---

### Data Storage

Responsible for persisting project data.

The storage implementation may change without affecting the business logic.

---

## Dependencies

The dependency direction is strictly one-way.

```text
User Interface
        ↓
Application Logic
        ↓
Data Storage
```

Lower layers must not depend on higher layers.

---

## Constraints

* Business rules belong only in the Application Logic layer.
* User Interface must not contain business logic.
* Data Storage must not implement business rules.
* Components should remain loosely coupled.

---

## Future Evolution

Future versions may introduce additional services such as:

* Authentication
* Notifications
* Reporting

These should be added without violating the existing layered architecture.

