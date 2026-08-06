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

## Dashboard

- Modern sidebar and top navigation shell
- Welcome section driven by `/api/profile/`
- Statistics cards for total, public, private, and average rating
- Quick actions for review and profile navigation
- Recent reviews summary with empty states

## Review CRUD

- My Reviews list with search, filters, sorting, and pagination
- Create Review form with validation and character counters
- Edit Review form that loads the selected review and updates it
- Delete Review confirmation flow with automatic refresh

## Public Reviews

- Dedicated public feed powered by `/api/public-reviews/`
- Search and pagination for browsing published reviews
- Shared review card rendering across the app

## Profile

- Profile summary from `/api/profile/`
- Username, email, member since, and review count
- Avatar placeholder and edit-profile placeholder button

## Project Screenshots

- Add dashboard, reviews, and profile screenshots here as the UI evolves.

## Backend

The frontend uses only this deployed backend:

`https://reviewlog.onrender.com/api/`

## Folder Structure

```text
src/
	api/
	components/
		common/
		layout/
		ui/
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
- The frontend talks directly to the Render backend at `https://reviewlog.onrender.com/api/`.
- API calls are centralized in the service layer.
