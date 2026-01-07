# T.T. Software Solution Assignment

T.T. Software Solution Assignment: Todo list web application

## Requirements

- Display Todo items from an API
- Add/Delete/Edit existing Todos
- Toggle status between Done/Not Done
- Use React (Functional Components) + TypeScript
- Manage state with React Context API
- Connect to an API (can use a mock API such as JSON Placeholder, or mock it yourself with MSW or fetch)
- Display proper Loading/Error states
- Include a README explaining how to run the project and the thought process behind it

## Pre-requisites

- Install [Node.js](https://nodejs.org/en/)

# Getting started

- Open Command Prompt or PowerShell
- Clone the repository

```
git clone https://github.com/PittawasChoo/ttss-assignment-react.git
```

- Install dependencies

```
cd ttss-assignment-react
npm run install:all
```

- Run the project

```
npm run dev
```

- Once the command log shows below logs, the web application is ready to useใ

```
  ROLLDOWN-VITE v7.2.5  ready in 443 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
API running on http://localhost:4000
```

## Project Structure

The folder structure of this app is explained below:

| Folder Name               | Description            |
| ------------------------- | ---------------------- |
| **client**                | Frontend folder        |
| **client/public**         | Public assets          |
| **client/src**            | Frontend source code   |
| **client/src/api**        | Api connecting files   |
| **client/src/app**        | Pages in application   |
| **client/src/assets**     | Static files           |
| **client/src/components** | Application components |
| **client/src/context**    | Context files          |
| **client/src/types**      | Types file             |
| **client/src/utils**      | Utility files          |
| **server**                | Backend folder         |
| **server/src**            | Backend source code    |
