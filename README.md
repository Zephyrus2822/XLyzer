# React + Vite

To start this project perform the following:

```
Step 1: create 2 terminals and enter frontend and backend folders in them.
Step 2: for frontend:
            npm i
            npm run dev
Step 3: for backend:
            First, create the .env file inside the directory by renaming the .en.example file and putting correct values
            npm start
            You should server running at localhost:5001 and MongoDB connected.

or, you can use Docker Compose
Simply run docker compose -f docker-compose.yml up -d 
It should start everything and you should get a MongdDB connected message!
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
