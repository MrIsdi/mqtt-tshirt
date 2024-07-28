const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/best_web_model', express.static(path.join(__dirname, 'best_web_model')));

// Setup MQTT client
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-message', (req, res) => {
  const topic = "rps_image_classification";
  const message = req.body.message;

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error('Failed to publish message', err);
      res.status(500).send('Failed to publish message');
    } else {
      res.send('Message published successfully');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
