const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

const commentsByPostId = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
})

app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id, content, status: 'pending' });
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
})

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log('Event Received:', req.body.type);

    if(type === 'CommentCreated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
    };

    res.status(200).send({ message: 'Event processed successfully' });
});

app.listen(4001, () => {
    console.log('Comments service rodando na porta 4001')
})