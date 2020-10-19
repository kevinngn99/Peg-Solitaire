const express = require('express');
const path = require('path');
const app = express();

let root = path.join(__dirname, '../client/build');

app.use(express.static(root));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.listen(process.env.PORT || 3000);