# AI Productivity Hub

Create a modern, responsive SaaS web application called AI Workplace Productivity Assistant.



Build this as a frontend-only application. Do not create a backend, database, authentication, login, registration, user accounts, or subscription/payment system. Keep it lightweight and suitable for a free Lovable account.



Design



Create a clean, modern, professional SaaS dashboard using:



- Light blue and dark navy/charcoal as the main colours

- White/light backgrounds

- Modern typography

- Rounded cards and buttons

- Clean spacing and subtle shadows

- Professional icons

- Fully responsive layout for desktop, tablet, and mobile



Navigation



Create a left sidebar with:



- Dashboard

- Smart Email Generator

- Meeting Notes Summarizer

- AI Task Planner

- Settings



On mobile, make the sidebar collapsible.



Dashboard



Create a welcoming dashboard showing:



- "AI Workplace Productivity Assistant"

- Short description: "Work smarter, communicate better, and organise your day with AI."

- Three main feature cards:

  1. Smart Email Generator

  2. Meeting Notes Summarizer

  3. AI Task Planner

- Quick-action buttons to open each tool.

- A small Responsible AI notice.



1. Smart Email Generator



Create an interface where the user can enter:



- Email purpose/topic

- Recipient

- Important points

- Optional subject



Provide tone selection:



- Formal

- Friendly

- Persuasive



Include a Generate Email button.



Display the generated email in an editable text area/card with:



- Subject

- Email body

- Copy button

- Regenerate button

- Clear button



Use a structured AI prompt internally so the generated email is professional, clear, concise, and appropriate for the selected tone.



2. Meeting Notes Summarizer



Create an input area where users can paste or type lengthy meeting notes.



Include a Summarize Meeting button.



Display results in separate editable sections:



- Meeting Summary

- Action Items

- Decisions

- Deadlines



Include:



- Copy button

- Regenerate button

- Clear button



Use a structured AI prompt that identifies important information without inventing details that are not present in the meeting notes.



3. AI Task Planner



Allow users to enter their tasks and optionally provide:



- Task name

- Priority

- Deadline

- Estimated duration



Allow the user to choose:



- Daily Schedule

- Weekly Schedule



Include a Generate Schedule button.



Display the generated plan as an attractive schedule/task list with:



- Time

- Task

- Priority

- Deadline

- Estimated duration



Allow users to edit tasks and generated schedule items.



Use a structured AI prompt that prioritises urgent and important tasks while creating a realistic and balanced schedule.



AI Output Behaviour



All generated AI content must be:



- Editable

- Easy to copy

- Clearly organised

- Professional

- Concise

- Easy to understand



Include loading states while AI content is being generated and friendly error messages if generation fails.



Responsible AI



Add a visible disclaimer throughout the application:



"AI-generated content may contain mistakes or omissions. Always review and verify AI outputs before sending emails, making decisions, or acting on recommendations."



Important



Do not add unnecessary features that require a backend or paid services.



The final application should feel like a polished, professional productivity SaaS product while remaining simple, lightweight, responsive, and easy to use.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1d460892-ea0c-4fb9-a0c3-632363642245).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
