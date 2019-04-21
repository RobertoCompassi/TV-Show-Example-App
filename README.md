# Frontend Developer Example for TV Show App
##### Developed by Roberto Compassi in São José do Rio Preto - SP, Brazil

This is a practical test implementing a navigation screen of an application for streaming tv shows. For the realization of this project it was only used HTML5, pre-processed CSS (SCSS), pure JavaScript applying ECMAScript6.

## How to install and run

Because you do not use third-party libraries or frameworks, you only need to compile ECMAScript6 (TypeScript files) and SCSS (Sass).

  - It is necessary to have installed SASS dependencies or other css processor to type .scss files
  - It is necessary to have the dependencies of the TypeScript compiler to compile .ts files.

#### 1) Build Style Sheets with SASS

```sh
$ cd [project root directory]
$ sass --watch assets/scss/application.scss:assets/css/style.css --style compressed
```

#### 2) Build the JavaScript file

```sh
$ cd [project root directory]
$ sass --watch assets/scss/application.scss:assets/css/style.css --style compressed
```
#### 3) Open the index.html file in the root of the project in the internet browser

## Application on Github Pages

[Published version of the application](https://robertocompassi.github.io/TV-Show-Example-App/)
## Notes
 - Some TV program details such as rating, country and percentage of indication were not available on the returned JSON object, so I chose not to show it on screen.
 - I have not used an MV * framewok as an Angular or library as jQuery to demonstrate the use of pure JavaScript.

 

