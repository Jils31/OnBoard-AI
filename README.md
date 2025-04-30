# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/50df86cb-7006-470e-97ab-fb8db2b2653d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/50df86cb-7006-470e-97ab-fb8db2b2653d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your API keys and credentials
3. Never commit `.env` file to version control

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_GEMINI_API_KEY`: Primary Gemini API key
- `VITE_GITHUB_CLIENT_ID`: GitHub OAuth client ID
- `VITE_GITHUB_CLIENT_SECRET`: GitHub OAuth client secret
- `VITE_POLAR_ACCESS_TOKEN`: Polar access token

Optional variables:
- `VITE_GEMINI_API_KEY_2`: Backup Gemini API key
- `VITE_GEMINI_API_KEY_3`: Backup Gemini API key
- `VITE_GEMINI_API_KEY_4`: Backup Gemini API key

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/50df86cb-7006-470e-97ab-fb8db2b2653d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
