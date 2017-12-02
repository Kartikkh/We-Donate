# WE Donate
> We are trying to a create a social network platform so that people willing to donate anything can get all information about events being organized by NGOs in their region/localities. They can follow, like, comment on events and share events being organized by NGOs through other social media platforms like facebook, whatsapp, twitter, etc. The users who have already subscribed to NGOs will get live feeds about the event posted by NGO's.
This is the Backend of our Application where we are constantly working on creating Api for our Ionic Application [We-Donate](https://github.com/Kartikkh/WeDonateMobileApp)

## Requirements

To run We Donate you'll need:

- [Node.js](https://nodejs.org/) v6+.
- [npm](https://www.npmjs.com/) v5+.

## Usage

### Getting started

You will need to fork the project and clone it locally, then go to `We-Donate` folder.

```sh
$ git clone git@github.com:YOUR_USERNAME/We-Donate.git
$ cd We-Donate
```

### Installation

Install all the dependencies

```sh
$ npm install
```

#### Adding Authentication Keys
Create a .env file in root directory and add 
```sh
secretKey = 'YOURKEY'
Access_key_ID = 'AMAZON S3 BUCKET ACCESS KEY'
Secret_access_key = ''AMAZON S3 BUCKET SECRET KEY'
bucketName = 'wedonate'
```

#### Now run the server 

```sh
$ npm start
```

For error checks (run Nodemon server)

```sh
$ npm run dev 
```


You can use postman to check the API endpoints.

### Testing

To run the tests locally, use the standard npm command:

```sh
$ npm test 
```

## Contribute

Feel free to raise an issue about a bug or new feature you would like to see in this project.
 
If you are willing to do some work, we will be glad to accept your PR.

## License

This project is [Licensed](LICENSE) under the MIT License (MIT).
