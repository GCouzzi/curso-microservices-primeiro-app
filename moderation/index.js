const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    console.log('Event Received:', type);

    if(type === 'CommentCreated'){
        const { id, content, postId, status } = data;

    }
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});