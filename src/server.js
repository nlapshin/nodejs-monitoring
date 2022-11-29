import express from 'express';

const PORT = process.env.PORT || 3000
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world')
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err)

    return;
  }

  console.log(`server start on ${PORT}`)
})
