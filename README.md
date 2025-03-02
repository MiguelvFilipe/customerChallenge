# CustomerChallenge

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Process and Approach

### Dependencies and Prerequisites
The project relies on Angular CLI 16.0.5, NgRx for state management, and NG-ZORRO for UI components. Also need NodeJS.


### Time Prioritization
First, I had to gather resources and learn Angular, which was quite a journey. I followed YouTube tutorials, read the documentation, experimented with templates, broke things and, of course, turned to my friend ChatGPT for help.

When starting the project, I prioritized implementing core features to ensure the application was functional and met the primary requirements. Once the core functionality was in place, I shifted my focus to additional features and optimizations. The next step was establishing a structured styling approach and the last step, I made sure to write some unit tests to cover key features of the application.

### Decision Points and Assumptions
- **State Management:** I chose NgRx for state management to handle complex state interactions and ensure a scalable architecture.
- **UI Components:** For styling and UI, I decided to divide it into two categories: styles for the overall structure and appearance of the app, and styles for individual components. For the structural and general design styles, I created my own custom styles. For component styling, I used NG-ZORRO, which I chose for its rich set of UI components that helped me quickly build a responsive and user-friendly interface.
- **Loading and Error Handling:** Implemented basic loading and error handling in services to manage API call loads and failures gracefully.

### Feedback and Reflections
- **Improved Error Handling:**  I would implement a more robust error handling mechanism, possibly with a global error handler. This would include user-friendly error messages and logging mechanisms to track issues and also implement alerts to notify users of errors and successful operations. This would improve user feedback and help users understand the application's state
- **Performance Optimization:** Optimize the application for better performance, especially for large datasets.
- **Enhanced Testing:** Increase the test coverage, especially for edge cases and integration tests.
- **User Experience Improvements:** Enhance the user experience by adding more intuitive navigation, better accessibility features, and responsive design to ensure the application works well on various devices and screen sizes.
- **Code Documentation:** Add more detailed documentation and comments within the code to improve maintainability.


