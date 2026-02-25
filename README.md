# Ellatech Frontend Developer Assignment

## Overview

This is a React Native app built with Expo and NativeWind to simulate a basic user and product management system. The application stores everything in local state (no backend required). A key emphasis was placed on implementing a beautiful and engaging UI with gradients, custom icons, subtle box shadows, and polished structural layouts to provide an excellent user experience. 

## Features
- **User Management**: Register users with basic validation.
- **Product Management**: Register products with SKUs, define initial quantities, and set prices.
- **Stock Adjustment**: Users can add or pull stock from existing products. The app prevents stock from going below zero.
- **Status Dashboard**: Get an overview of all products, out-of-stock items, and low-stock products.
- **Transaction History**: Displays a simple paginated list of all changes made across the platform.

## Setup and Run Instructions

Make sure you have Node installed (preferably Node v18+) and your Expo CLI tools available.

1. Clone the repository and navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```

## Note on Approach and Trade-offs

### Approach
- **Global State Management**: `AppContext` manages the local state utilizing `React.useState` and `React.useEffect`. Because an API is not required, keeping the operations in a single localized Context makes the state available to all Tab Screens securely without heavy prop drilling.
- **Beautiful UI System**: The app utilizes `expo-linear-gradient` and NativeWind for rapid UI styling, avoiding repetitive boilerplate styling files. Custom layout cards give physical dimensions to components (using shadows, paddings, rounded corners).
- **Navigation**: Uses `expo-router` for file-based routing and a simple Bottom Tab layout for easy navigability across core routes. The layout defaults to utilizing `Ionicons` to remain cleanly integrated and well maintained properly within the Expo ecosystem.

### Trade-offs & Future Improvements
- **Data Persistence**: Currently, the data only exists memory-bound. If the app is fully restarted, local state resets. Utilizing `AsyncStorage` or `SQLite` would be vital for actual offline usability without a backend.
- **Pagination Strategy**: The Transaction History uses simple array slicing (`transactions.slice(...)`) for pagination. Though efficient for smaller sets, with heavy usage this structure should rely on a flat list's native virtualized properties alongside async data loading.
- **Validation Scale**: Basic validation mechanisms operate smoothly on individual forms. As the project grows, migrating to structured validation frameworks like `Zod` combined with `React Hook Form` would enhance state management and validation error decoupling.
