var express = require('express');
var app = express();
var req = require('request');
var port = process.argv[2] || 3000;
var targetPort = process.argv[3] || 3001;
var host = 'localhost';
var http = require('http');
var request = require('request');
var bodyParser = require('body-parser');
// var {books} = require('./books');

//state of local gossip
//3000: {port:3000, uuid: 3001, va}
let nodeState = {};
var favBook = 'Story';
var version = 0;
var gossipHistory = [];
var peers = [];
var ttl = 4;

//get the params from the console
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

//pick a random book and set it to favBook
const pickRandomBook = () => {
  let random = Math.floor(Math.random() * 55) + 1;
  favBook = books[random];
  console.log(favBook);
};

//call that function every 10 sec
setInterval(pickRandomBook, 10000);

//call the gossip () which sends its peers a msg.

app.get('/gossip', (req, res) => {
  request(
    {
      url: 'http://localhost:' + targetPort + '/gossip',
      method: 'POST',
      json: { UUID: UUID, fromPort: port, version: version, TTL: ttl, favBook: favBook }
    },
    function(error, response, body) {
      console.log('body232', body);
      //save to peers
      peers.push(body);
    }
  );

  res.send('gossip sent');
});

app.post('/gossip', (req, res) => {
  console.log(req.body.favBook);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log(books);
  res.sendFile(__dirname + '/index.html');
});

app.get('/bootstrap', (req, res) => {
  request(
    {
      url: 'http://localhost:' + targetPort + '/peers',
      method: 'POST',
      json: { fromPort: port }
    },
    function(error, response, body) {
      console.log('body232', body);
      //save to peers
      peers.push(body);
    }
  );

  res.send('sent bootstrap');
});

app.post('/peers', (req, res) => {
  //find the port from the req
  console.log(req.body.fromPort);
  //save in peers array
  peers.push(req.body.fromPort);
  //send this back to the callback
  res.send(port);
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});

const books = [
  'Lucky Jim by Kingsley Amis',
  'Money by Martin Amis',
  'The Information by Martin Amis',
  'The Bottle Factory Outing by Beryl Bainbridge',
  'According to Queeney by Beryl Bainbridge',
  "Flaubert's Parrot by Julian Barnes",
  'A History of the World in 10 1/2 Chapters by Julian Barnes',
  'Augustus Carp, Esq. by Himself: Being the Autobiography of a Really Good Man by Henry Howarth Bashford',
  'Molloy by Samuel Beckett',
  'Zuleika Dobson by Max Beerbohm',
  'The Adventures of Augie March by Saul Bellow',
  'The Uncommon Reader by Alan Bennett',
  'Queen Lucia by EF Benson',
  'The Ascent of Rum Doodle by WE Bowman',
  'A Good Man in Africa by William Boyd',
  'The History Man by Malcolm Bradbury',
  'No Bed for Bacon by Caryl Brahms and SJ Simon',
  'Illywhacker by Peter Carey',
  'A Season in Sinji by JL Carr',
  'The Harpole Report by JL Carr',
  'The Hearing Trumpet by Leonora Carrington',
  'Mister Johnson by Joyce Cary',
  "The Horse's Mouth by Joyce Cary",
  'Don Quixote by Miguel de Cervantes',
  'The Case of the Gilded Fly by Edmund Crispin',
  'Just William by Richmal Crompton',
  'The Provincial Lady by EM Delafield',
  'Slouching Towards Kalamazoo by Peter De Vries',
  'The Pickwick Papers by Charles Dickens',
  'Martin Chuzzlewit by Charles Dickens',
  'Jacques the Fatalist and his Master by Denis Diderot',
  'A Fairy Tale of New York by JP Donleavy',
  'The Commitments by Roddy Doyle',
  'Ennui by Maria Edgeworth',
  'Cheese by Willem Elsschot',
  "Bridget Jones's Diary by Helen Fielding",
  'Joseph Andrews by Henry Fielding',
  'Tom Jones by Henry Fielding',
  'Caprice by Ronald Firbank',
  'Bouvard et Pécuchet by Gustave Flaubert',
  'Towards the End of the Morning by Michael Frayn',
  'The Polygots by William Gerhardie',
  'Cold Comfort Farm by Stella Gibbons',
  'Dead Souls by Nikolai Gogol',
  'Oblomov by Ivan Goncharov',
  'The Wind in the Willows by Kenneth Grahame',
  "Brewster's Millions by Richard Greaves (George Barr McCutcheon)",
  "Squire Haggard's Journal by Michael Green",
  'Our Man in Havana by Graham Greene',
  'Travels with My Aunt by Graham Greene',
  'Diary of a Nobody by George Grossmith',
  'The Little World of Don Camillo by Giovanni Guareschi',
  'The Curious Incident of the Dog in the Night-time by Mark Haddon',
  'Catch-22 by Joseph Heller',
  'Mr Blandings Builds His Dream House by Eric Hodgkins'
];
