const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Setup MQTT client
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

app.post('/send-message', (req, res) => {
  const topic = "skin-facial-yolo";
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

module.exports = app