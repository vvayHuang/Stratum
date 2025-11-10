# How to get your Gemini API key

Follow these steps to get your Gemini API key and set it up in the project.

## 1. Get your API key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click on the **"Get API key"** button in the top left corner.
4.  Click on **"Create API key in new project"**.
5.  Copy the generated API key.

## 2. Set up your API key in the project

1.  Create a file named `.env` in the root of the project.
2.  Add the following line to the `.env` file, replacing `your-api-key-here` with the key you copied:

    ```
    GEMINI_API_KEY=your-api-key-here
    ```

Now you are ready to run the project with your Gemini API key.