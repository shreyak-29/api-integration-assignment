# API Integration Assignment

## Project Overview
This is a Next.js 13+ app using the app directory structure. It integrates Firebase authentication and Cashfree payment gateway, styled with Tailwind CSS v4.

## Setup Instructions

### 1. Clone the Repository
```sh
# Replace with your repo URL
git clone <your-repo-url>
cd api-integration-assignment
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root with your credentials:
```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
CASHFREE_SANDBOX_APP_ID=your_cashfree_app_id
CASHFREE_SANDBOX_SECRET_KEY=your_cashfree_secret_key
```

### 4. Tailwind CSS v4 Setup
- Tailwind is already configured for v4.
- If you need to update `globals.css`, use:
	```css
	@import "tailwindcss/preflight";
	@import "tailwindcss/utilities";
	```
- The config file is `tailwind.config.js`.

### 5. Start the Development Server
```sh
npm run dev
```

### 6. Usage
- Visit `http://localhost:3000` for the main page.
- Go to `/checkout` for payment integration.
- Authentication uses Firebase (Google Sign-In).

### 7. Project Structure
```
app/
	favicon.ico
	globals.css
	layout.js
	page.js
	api/
		auth/
			login/
				route.js
		createOrder/
			route.js
	checkout/
		page.js
	lib/
		firebase.js
		firebaseAdmin.js
		mongodb.js
	models/
		user.js
public/
	...svg files
```

## Troubleshooting
- If Tailwind styles are not visible, ensure you are using Tailwind v4 syntax in `globals.css` and have run `npm install`.
- For Cashfree errors, check your environment variables and ensure the SDK is loaded using Next.js `<Script>`.

## License
MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
