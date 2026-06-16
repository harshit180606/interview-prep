import app from './index'

const port: number = 5000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})