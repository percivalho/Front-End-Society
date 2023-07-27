# Front-End-Society

## User Story

```md
As a user I want to be able to search for my favourite songs. Once I find a song through a public playlist or search bar, I can then play the snippet of the song that I searched for. When I have found the song, then I can add it to my playlist, so that I can listen to them at a later date. I also want to be able to add comments to public playlists so that others and view my opinions on them. Finally,  I want to log in to my account and have the website remember my comments and playlists I’ve created.
```

## Acceptance Criteria

```md
When I click on the login button
Then I am presented with a page for me to register my login details such as username and password in order to grant me access to the website
When I search for a song
Then I am provided with the search results and snippet of the song.
When I press the image button of the playlist
Then a list of the songs in the playlist appears
When I click on the play button on the songslist
Then the song begins to play
When I click on the add to playlist button attached to the song
Then the song is added to my playlist
When I click on my playlist
Then I am presented with the names of all the songs I have saved and I have the option to remove the songs from the playlist whenever I choose
When I look at the website from multiple browsers
Then I am presented with a responsive UI that looks good on all devices
```

## Project Product Description

Our music website, powered by Node.js and Express.js, delivers a seamless experience with cutting-edge technologies.
We utilized two new technologies in this project.
Firstly, we used svgator to generate the logo of our website
and secondly, using Howler.js, we created an immersive audio player which enhanced the music discovery process for he user(s).
Our RESTful API, built with Node.js and Express.js, ensures efficient data retrieval and seamless addition of new content through GET and POST routes.
We leverage the power of Handlebars.js as our template engine, providing a dynamic and visually stunning UI.
Our database, powered by MySQL and the Sequelize ORM, ensures reliable and scalable storage for music preferences.
We incorporated authentication using express-session and cookies, guaranteeing privacy and prioritizing data protection by safeguarding API keys and sensitive information with environment variables.
We adhered to the MVC paradigm for a well-structured folder hierarchy. Moreover, we followed best practices to maintain a clean code, and provide comprehensive comments for readability and maintainability.
With our deployment on Heroku, access to our music website is available anytime, anywhere, while enjoying a responsive and polished UI that adapts seamlessly to your device.

## Usage
When the user opens this application, they are first presented with the homepage. This contains a navigation bar at the top of the page with links to the ‘Home’, ‘My Playlist’ and ‘Login’. When the user selects one of these options they will be redirected to the according page. The user will also see an animated logo at the top of every page. To create an account the user will have to click the ‘Sign up’ at the bottom of the login page. The user can enter their own username, password and select a sound from the drop-down list to play when they login to the site; to complete sign up the user must click the ‘sign up’ button. If the user already has an account, they can login by entering their username and correct password and select login; if the user enters the wrong username or password, they will be alerted that they have failed to login. In order to view the albums on the homepage or the ‘My Playlist’ a user must be logged in, if not they will be redirected to the login page. When login is successful the user will see ‘Hi’ followed by their username at the top of the website.
In the home page, a list of randomised albums will appear, all of which have titles and accompanying images. By selecting on the album title or image, the user can then view all of the songs in the album and add them to their playlist with the plus button on the righthand side. When successfully added to their playlist, a message will appear below telling the user the song was added. The user will also be able to view comments written about the albums as bubbles floating on the screen. At the bottom of the page the user can add to these comments by entering their comment in the text box and clicking submit, after clicking submit the page will refresh and display all comments as bubbles including the new comment.
If the user then selects the ‘My Playlist’ link in the navigation bar they will see all of the songs they have added to their own playlist. They will also have the option to remove songs by selecting the bin icon next to each song. On the left side of the page, the user will also be given the option to search for more songs by entering the song title or artist’s name and then clicking enter. The results will appear on the right side of the page with a list of the songs. The text the user enters will also appear on the search history below the search bar. This improves the user experience as its easy to click on and view their recent searches. After the user has finished searching for new songs, they can view their playlist again by either refreshing the page or clicking ‘my playlist’ again in the nav bar.

## Installation
To install this application please add your username and password into a .env file for your own protection, please use .env.EXAMPLE file for support. Then type the following demands in the terminal:
```md
npm i
mysql -u root -p
```
Then when prompted enter your mySQL password. Please ensure you have properly logged into your mySQL before continuing.
```md
source db/schema.sql
quit;
```
```md
npm run seed
npm run start
```

## Technologies Used

This application is built using the following technologies:

- **Node.js**
- **Express.js**
- **Howler.js**
- **bcrypt**
- **Sequelize**
- **dotenv**
- **MySQL**
- **Heroku**
- **Handlebars Engine**
- **CSS**
- **JavaScript**
- **SVGator**


## Credits

- https://youtu.be/noC22oMVb44 - for the inspiration on the bubbles creation using css and vanilla javascript
- Jason Sammon - provided great sound files for login sound choices.

## Screenshots
![A screenshot of the homepage](/public/assets/homepage.png)
![A screenshot of the public playlists](/public/assets/album.png)
![A screenshot of the login page](/public/assets/login.png)
![A screenshot of the sign up page](/public/assets/signup.png)
![A screenshot of the My Playlist page](/public/assets/myplaylist.png)

## Link to webpage

```md
Link to Heroku:

https://front-end-society-2d48b234d58b.herokuapp.com

Link to GitHub repo:

https://github.com/percivalho/Front-End-Society.git
```
