# AOS Backend — Setup (all done on websites, no installs)

## 1. Supabase (database)
1. Go to supabase.com → sign up → "New Project"
2. Open the **SQL Editor** → paste everything from `supabase-schema.sql` → Run
3. Go to Project Settings → API → copy the **Project URL** and the **service_role key**

## 2. GitHub (code home)
1. Go to github.com → "New repository" → name it `aos-backend`
2. Click **"Add file → Upload files"** → drag in this whole folder
   (keep the `api` folder structure exactly as-is)
3. Commit the files

## 3. Vercel (hosting)
1. Go to vercel.com → sign up → "Add New → Project" → import the `aos-backend` repo
2. Before deploying, open **Environment Variables** and add:
   - `SUPABASE_URL` = the Project URL from step 1
   - `SUPABASE_SERVICE_KEY` = the service_role key from step 1
3. Click Deploy — you'll get a live link like `aos-backend.vercel.app`

## 4. Connect the frontend
In `api.js` (your frontend file), change:
```js
const BASE_URL = '/api';
```
to:
```js
const BASE_URL = 'https://aos-backend.vercel.app/api';
```
Then uncomment the real `request(...)` line in each function (starting with
`projects`, `tasks`, `comments`, `approvals`, `members`, `teams`) and delete
its `notImplemented(...)` line.

That's Projects, Tasks, Comments, Approvals, Members, and Teams live.
Everything else in `api.js` (Admin CMS, Finance, Reports, Notifications,
Microsoft Graph) follows the exact same file pattern — copy any file in
`/api` as a template when you're ready to add the next one.
