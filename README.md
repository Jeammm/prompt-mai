![Static Badge](https://img.shields.io/badge/-Made_with_Next.js-grey?logo=nextdotjs)   ![Static Badge](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=flat-square)  ![Static Badge](https://img.shields.io/badge/-MongoDB-green?logo=mongodb&logoColor=black&style=flat-square) 

# Prompt Mai - AI-Prompt Sharing Website

Welcome to Prompt Mai, a website designed for sharing and collaborating on AI-Prompt ideas with the community. With Prompt Mai, you can effortlessly post, edit, delete, upvote, and downvote AI-Prompts. This README will guide you through the setup, features, and usage of the project.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)

## Features

- **User Authentication**: Secure user accounts and authentication for posting and voting on AI-Prompts.
- **Create AI-Prompts**: Share your AI-Prompt ideas with the community.
- **Edit and Delete AI-Prompts**: Update or remove your AI-Prompts as needed.
- **Voting System**: Upvote or downvote AI-Prompts to highlight the best ideas.
- **Responsive Design**: The website is designed to work seamlessly on various devices.
- **Serverless Deployment**: Deployed effortlessly with Vercel for high availability and scalability.

## Technologies Used

Prompt Mai is built using the following technologies:

- [Next.js](https://nextjs.org/): A React framework for building efficient and scalable web applications.
- [MongoDB](https://www.mongodb.com/): A NoSQL database for storing AI-Prompt data.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for styling.
- [Vercel](https://vercel.com/): A serverless deployment platform for hosting web applications.

## Getting Started

To get Prompt Mai up and running on your local machine, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/prompt-mai.git
   cd prompt-mai
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   bun install
   ```

3. **Configure Environment Variables**:

   Create a `.env.local` file in the project root and configure the following variables:

   ```env
    GOOGLE_ID=your-google-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    MONGODB_URI=your-mongpdb-uri
    NEXTAUTH_URL=http://localhost:3000/
    NEXTAUTH_URL_INTERNAL=http://localhost:3000/
    NEXTAUTH_SECRET=random-string-secret
   ```

   Replace field with your proper value.

4. **Run the development server**:

   ```bash
   npm run dev
   ```

   or

   ```bash
   bun dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000` to access Prompt Mai locally.

## Usage

Once Prompt Mai is up and running, you can start using it to share and interact with AI-Prompt ideas:

- **Create an Account**: Sign up or log in to start posting and voting on AI-Prompts.

- **Post an AI-Prompt**: Share your AI-Prompt idea with the community by clicking the "Post" button and filling in the necessary information.

- **Edit and Delete AI-Prompts**: You can edit or delete your own AI-Prompts by navigating to the respective prompt and clicking the appropriate buttons.

- **Vote on AI-Prompts**: Show your support for AI-Prompts you like by upvoting or downvoting them.
