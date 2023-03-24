import http from 'node:http'

const server = http.createServer((req, res) => {
  return res.end('hello ignite')

})

server.listen(3333) //localhost:3333