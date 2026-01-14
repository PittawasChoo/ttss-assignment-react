# Todo List Web Application

T.T. Software Solution Assignment: Todo List Web Application

## Requirements

Create a simple React web application with a Todo List screen that can:

1. Display Todo items from an API

-   Add/Delete/Edit existing Todos
-   Toggle status between Done/Not Done

2. Use React (Functional Components) + TypeScript
3. Manage state with React Context API
4. Connect to an API (can use a mock API such as JSON Placeholder, or mock it yourself with MSW or fetch)
5. Display proper Loading/Error states
6. Include a README explaining how to run the project and the thought process behind it

## Pre-requisites

-   Install [Node.js](https://nodejs.org/en/)

## Getting started

-   Open Command Prompt or PowerShell
-   Clone the repository

```
git clone https://github.com/PittawasChoo/ttss-assignment-react.git
```

-   Install dependencies

```
cd ttss-assignment-react
npm run install:all
```

-   Run the project

```
npm run dev
```

-   Once the command log shows below logs, the web application is ready to use

```
  ROLLDOWN-VITE v7.2.5  ready in 246 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

and

```
Backend running on http://localhost:4000
```

## Project Structure

```bash
├── backend/
│   ├── db/
│   │   └── *.json (database in json file)
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/ (data type)
│   │   ├── routes/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── apis/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── views/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

## Project Features

| Feature              | Description                                                                         |
| -------------------- | ----------------------------------------------------------------------------------- |
| Add/Edit/Delete todo | Get and manage Todo items                                                           |
| Due date             | The todo item with due date which can warn (show in red) when the to do is over due |
| Position             | To manage priority of the todo items, each item have its own position from 1-n      |
| Optimistic           | To make a better UX, seemless api calling                                           |
