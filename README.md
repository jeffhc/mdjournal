# `MDJournal` | Markdown Journal

---

Markdown Journal is a simple, fast, cloud-based note taking app for all purposes.
MD Journal uses the Markdown language for writing into documents, which is extremely simple and allows for a lot of flexibility. It's very similar to just typing text, with some added functionality. A quick tutorial for Markdown can be found [here]((https://www.markdownguide.org/basic-syntax/)). A quicker handy reference can be found [here](https://simplemde.com/markdown-guide).


### Features
- Create and edit Markdown/text files, which are automatically saved to the cloud.
- Organize files into folders.
- Auto-save functionality: every edit you make is saved into the cloud, kinda like Google Docs.

### Features to be implemented
- Delete files and folders. 
- Move around files and folders. (Drag and drop functionality.)
- Sorting files and folders by date and name in the explorer.
- Search functionality.

### Installation instructions

1. Install Node.js@^12.0 and npm@^6.0
2. `git clone https://github.com/jeffhc/mdjournal.git`
3. `npm install`
4. Create a file *config/Config.js* that exports an object with a `secret` and a `MONGODB_DATABASE`.
5. `npm start` runs development mode, `npm run production` runs production mode (no stack traces in render functions)

> Markdown journal is based off of [epsas](https://github.com/jeffhc/epsas), or the Express Passport Session Authentication Skeleton.