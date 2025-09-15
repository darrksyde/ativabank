# Ativabank Frontend - Copilot Instructions

This document provides guidance for AI agents contributing to the Ativabank frontend codebase.

## Project Overview & Architecture

🏦 Ativabank: A Comprehensive Brainstorming Document

1. App Overview & Tier Breakdown

This document outlines the foundational plan for a tiered, feature-rich mock banking application, Ativabank. The core premise is a simulated banking environment where users can perform various financial actions without real-world monetary transactions. The application is structured into three distinct user tiers, each with a specific set of permissions and capabilities.

Super Admin: The highest level of authority. Their primary role is system management and oversight, including the ability to create and manage Admin-level users.

Admin: The operational core of the application. Admins manage all customer accounts, including creation, funding, transaction history management, and the ability to control key account features like transfers and card funding.

Customer: The end-user. Customers can view their account details, perform transfers, manage their cards, and view transaction history and insights.

1. Core Technology Stack
Frontend Framework: Next.js

UI Components: shadcn/ui and Radix UI. Utilize these libraries for all UI components, such as tables, dialogs, dropdowns, and cards.

Styling: Tailwind CSS. All styling should be implemented using Tailwind utility classes. Do not use custom CSS files.

Language: TypeScript (.tsx files).

2. Frontend File Structure
Generate the following file and folder structure. All components and pages should be functional React components.

pages/

_app.tsx: The main application shell. Set up global styles and context providers here.

index.tsx: The primary landing page, which will serve as the login screen.

super-admin/: Folder for all Super Admin pages.

index.tsx: The Super Admin dashboard.

[id].tsx: A dynamic page for managing a specific Admin user.

admin/: Folder for all Admin pages.

index.tsx: The main Admin dashboard.

[id].tsx: A dynamic page for managing a specific Customer account.

customer/: Folder for all Customer pages.

index.tsx: The main Customer dashboard.

card.tsx: Page for card funding functionality.

transfers.tsx: Page for handling money transfers.

history.tsx: Page for viewing transaction history.

components/

ui/: Placeholder for generated shadcn/ui components.

layout/: Reusable components like a navigation header or sidebar.

common/: Components shared across different user types (e.g., a generic TransactionList component).

super-admin/: Super Admin-specific components.

admin/: Admin-specific components.

customer/: Customer-specific components.

3. Conceptual Wireframes (Component-Based Instructions)
Generate the code for each dashboard, implementing the following component-level instructions.

Super Admin Dashboard (super-admin/index.tsx)
Header: A header component containing the Ativabank logo, the text "Super Admin", and a user profile button with a logout option.

Main Content: A shadcn/ui Table component to display a list of all existing Admins.

Table Columns: Name, Email, Status (Active/Blocked), and Actions.

Actions Column: Use buttons or a dropdown for "Edit" and "Block/Unblock" functionality.

Controls: A prominent shadcn/ui Button with the text "Create New Admin" that, when clicked, opens a shadcn/ui Dialog modal with a form to create a new admin.

Admin Dashboard (admin/index.tsx)
Header: A header component with the Ativabank logo, "Admin" title, and a user profile button.

Main Content: A shadcn/ui Table component to display a list of all customers.

Table Columns: Name, Account Number, Balance, and Actions.

Actions Column: Use a radix-ui DropdownMenu with options to "View/Manage" and "Delete" the customer account.

Controls: A "Create New Customer" button that opens a form to add a new customer.

Customer Dashboard (customer/index.tsx)
Header: A header component with the Ativabank logo, "Customer" title, and a user profile button.

Sidebar Navigation: A radix-ui NavigationMenu with links for "Dashboard", "Transfers", "Cards", and "Settings".

Main Content:

A visually appealing shadcn/ui Card component to display the current account balance.

A "Quick Actions" section with buttons for "Transfer" and "Fund Card".

A section displaying recent transactions in a list format.

A small card displaying BTC and USDT wallet addresses.

Card Funding Page (customer/card.tsx)

This page should have three distinct sections for funding with BTC and USDT. and balance.

BTC Funding Section: Display the BTC wallet address with a note: "Credit your BTC address to fund your card".

USDT Funding Section: Display the USDT wallet address with a note: "Credit your USDT address to fund your card".

fund with balance where the user can fund the card with the baccount balance

4. General Principles
Responsiveness: Use Tailwind's responsive modifiers (sm:, md:, lg:) to ensure the layout is fully responsive and looks great on all devices.

State Management: Use useState and useEffect for local component state.

Styling: Use Tailwind CSS for all styling.

Comments: Add brief, clear comments to explain complex logic or component purpose.

This is a [Next.js](https://nextjs.org/) project using the **Pages Router** architecture. The main application files are located in the `src/pages` directory.

- **Framework**: Next.js 14 with TypeScript
- **UI**: [Tailwind CSS](https://tailwindcss.com/) integrated with [shadcn/ui](https://ui.shadcn.com/).
- **Styling**:
    - Global styles and CSS variables are defined in `src/styles/globals.css`.
    - Tailwind CSS configuration is in `tailwind.config.ts`.
- **Components**:
    - Reusable UI components built with `shadcn/ui` should be placed in `src/components`.
    - The core component library from `shadcn/ui` is configured, and new components can be added via the CLI: `npx shadcn-ui@latest add [component-name]`.
- **Import Alias**: The project uses `@/*` as an import alias for the `src/` directory. For example, `import { cn } from '@/lib/utils'`.

## Developer Workflow

- **Running the development server**:
  ```bash
  npm run dev
  ```
  The application will be available at [http://localhost:3000](http://localhost:3000).

- **Building the project**:
  ```bash
  npm run build
  ```

- **Linting**:
  ```bash
  npm run lint
  ```

## Key Files and Directories

- `src/pages/_app.tsx`: The main application component. Global styles are imported here.
- `src/pages/index.tsx`: The main landing page for the application.
- `src/styles/globals.css`: Contains base Tailwind directives and CSS variables for `shadcn/ui` theming.
- `tailwind.config.ts`: Configuration for Tailwind CSS, including theme, plugins, and content paths.
- `components.json`: Configuration file for `shadcn/ui`.
- `src/lib/utils.ts`: Utility functions, including the `cn` helper for merging Tailwind classes.

## Coding Conventions

- **Component Structure**: Follow the patterns established by `shadcn/ui` when creating new components.
- **Styling**: Use Tailwind CSS utility classes for styling. Avoid writing custom CSS files unless absolutely necessary.
- **State Management**: For now, use React's built-in state management (`useState`, `useReducer`, `useContext`). We will re-evaluate if a more complex solution is needed.
