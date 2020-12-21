# Cycle_of_benefits

A waste management crowdsourcing platform for environmentally related projects.

# Table of Contents

- [Getting Started](#getting-started)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Preview Live](#preview-live)

## Getting Started

This is a fullstack javascript application built with [**React**](https://reactjs.org/) and [**Node**](https://nodejs.org/en/) using [**Express**](https://expressjs.com/) framework. The frontend was initially created with **vanilla javascript**, **embedded Javascript (ejs)** templating engine and **SQL database** but was refactored using **React** with the database migrating from the [Relational Database System implemented in AWS](https://aws.amazon.com/rds/) to **MongoDB**. The application runs on a [MongoDB atlas cluster](https://www.mongodb.com/cloud/atlas) and is live on Heroku -[cycle_of_benefits](https://cyobs.herokuapp.com/)

## Technology Stack

**Client Side**

1. ReactJS
2. [Materialize-css](https://materializecss.com/)

**Server Side**

1. NodeJS
2. Express FrameWork
3. MongoDB

## Installation

1. Install [**Node JS**](https://nodejs.org/en/).
2. Clone the [**repository here**](https://github.com/colenocks/cycle_of_benefits)
3. [**cd**] into the root of the **project directory**.
4. Run `npm install` on the terminal to install project dependecies
5. Create a `.env` file in the root directory of the application. Example of the content of a `.env` file is shown in the `.sample-env`
6. [**cd**] into the **frontend** folder in a seperate terminal.
7. Run `npm install` to install frontend React dependecies

8. Start the application:
   **_Development Environment only_**

   **Backend server**

   ```
   npm run dev
   ```

   **Frontend**

   ```
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Preview Live

Preview application live on heroku: [cycle_of_benefits](https://cyobs.herokuapp.com/)
