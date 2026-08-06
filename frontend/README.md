# ReviewLog Frontend

ReviewLog is a React + Vite frontend for the ReviewLog review management app. It connects to the deployed Django REST backend on Render and uses JWT authentication with automatic token refresh.

## Stack

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS v4
- shadcn/ui patterns
- Lucide React

## Authentication

- Login with username and password
- Register with username, email, password, and confirm password
- JWT access and refresh tokens stored in local storage
- Automatic bearer token attachment
- Automatic token refresh and retry on 401 responses
- Auto logout when refresh fails

## Backend

The frontend uses only this deployed backend:

`https://reviewlog.onrender.com/api/`

## Folder Structure

```text
src/
	api/
	components/
	context/
	hooks/
	layouts/
	pages/
	routes/
	services/
	styles/
	utils/
```

## Key Routes

- `/login`
- `/register`
- `/dashboard`
- `/profile`
- `/reviews`
- `/settings`

## Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Notes

- The app never uses localhost for API requests.
- Authenticated pages are wrapped with protected routing.
- The dashboard loads the current profile from `/api/profile/`.
