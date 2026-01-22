# 🚀 Project Manager SaaS (Enterprise Edition)

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A high-performance, secure, and scalable Project Management platform built for modern enterprise teams. This system provides a mature workflow for Admins, Project Leads, and Team Members, featuring agile tools, real-time analytics, and enterprise-grade governance.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [👤 User Personas & Permissions](#-user-personas--permissions)
- [🛠️ Core Modules](#-core-modules)
- [🔒 Technical Architecture & Security](#-technical-architecture--security)
- [🚀 Roadmap & Lifecycle](#-roadmap--lifecycle)
- [🔧 Installation & Setup](#-installation--setup)

---

## ✨ Key Features

### 🛠️ Strategic Management (Admin Portal)
- **Organization Control**: Global user management, role assignment, and access revocation.
- **Enterprise Governance**: Immutable system-wide **Audit Logs** for security-sensitive actions.
- **Data Safety**: Unified **Soft Delete** pattern across all entities with a one-click restoration panel.
- **Global Analytics**: Real-time heatmaps, velocity charts, and member performance metrics.

### 🏃 Agile Execution (Associate & Member)
- **Advanced Kanban**: Role-based board interaction with **Work-In-Progress (WIP) Limits**.
- **Task Orchestration**: Blockers, horizontal dependencies, and deadline management.
- **Sprint Engine**: Dedicated planning and execution cycles with milestone tracking.
- **Real-time Collaboration**: Direct task commenting, global activity feeds, and notification engine.

---

## 👤 User Personas & Permissions

| Role | Permissions | Dashboard |
| :--- | :--- | :--- |
| **Admin** | Full Organization Access, Audit Logs, User Mgmt, Data Restoration | `/admin/dashboard` |
| **Associate** | Create Projects & Tasks, Manage Sprints, View Analytics | `/associate/dashboard` |
| **Member** | Update Assigned Tasks, Post Comments, View Project Board | `/member/dashboard` |
| **Guest** | Read-Only view of assigned projects (No status edits/comments) | `/public/project/[token]` |

---

## 🛠️ Core Modules

### 1. Unified Kanban Engine
The heart of the application, designed for complex workflows:
- **WIP Limits**: Prevents bottlenecks by capping tasks per column (Admin configurable).
- **Dependencies**: Tasks can be linked together; the system prevents moving "Blocked" tasks.
- **Micro-Animations**: Smooth drag-and-drop feedback for optimized UX.

### 2. Enterprise Governance & Audit
Designed for compliance-heavy environments:
- **Audit Logs**: Every status change, project share, and user role update is cryptographically logged.
- **Resilience**: Centralized error masking prevents sensitive SQL or stack trace leakage to the client.

### 3. Public Accessibility (Stakeholder View)
- **Security**: Cryptographically unguessable share tokens.
- **Revocation**: Admins can instantly kill a project share link, revoking all external access.

---

## 🔒 Technical Architecture & Security

### **Data Layer: Supabase & PostgreSQL**
- **RLS (Row Level Security)**: Every query is validated at the database level using JWT claims.
- **Soft Deletes**: Uses `deleted_at` timestamps for data recoverability.
- **Performance**: High-concurrency optimized with indexes on velocity-critical columns.

### **Server Layer: Next.js App Router**
- **Middleware**: Validates session persistence and role-based access for every request.
- **Server Actions**: Standardized with professional error handling and success response wrappers.

---

## 🚀 Roadmap & Lifecycle

- [x] **Phase 1-2**: Foundation, Auth, and Basic Project Core.
- [x] **Phase 3-4**: Agile Features (Kanban, Sprints, Dependencies).
- [x] **Phase 5**: Analytics & Reporting Engine.
- [x] **Phase 6**: Governance & Production Hardening (Soft Deletes, Pagination, Audit Logs).
- [ ] **Phase 7+ (Next)**: External Integrations, Real-time Push Notifications, Mobile App.

---

## 🔧 Installation & Setup

### 1. Prerequisites
- Node.js 18.17+
- Supabase account & project

### 2. Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-client-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-admin-service-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Quick Start
```bash
# Clone and install
git clone https://github.com/your-repo/project-manager.git
cd project-manager
npm install

# Run migration
# Apply files in /supabase/migrations/ in sequential order

# Start development
npm run dev
```

---

## 🛡️ Support & Governance
Built for enterprise-grade project management. This repository is maintained with a strict production-first mentality.
