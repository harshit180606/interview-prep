import app from './index'

const port: number = parseInt(process.env.PORT || '5000')

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})