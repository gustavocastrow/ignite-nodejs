import { Readable, Writable, Transform, Duplex } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1
  _read(){
    const i = this.index++

    setTimeout(() => {
    if (i > 100){
      this.push(null)
    } else {
      const buf = Buffer.from(String(i))
      this.push(buf)
    }
    }, 1000)

  }
}

class InverseNumber extends Transform {
  _transform(chunk, enconding, callback){
    const transformed = Number(chunk.toString()) * - 1

    callback(null, Buffer.from(String(transformed)))
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, enconding, callback){
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new OneToHundredStream()
.pipe(new InverseNumber())
.pipe(new MultiplyByTenStream())


//Tentando ler a stream, enquando ela ta lendo já vai escrevendo no terminal
//Estamos lendo dados de uma stream(OneToHundredStream) que esta retornando números
//de 1 a 100 e ao mesmo tempo estamos escrevendo esses dados dentro de uma stream
//de escrita (MultiplyByTenStream) que processa dados pegando cada um dos números da
//OneToHundredStream e multiplicando por 10

//A stream Readable só conseguimos ler dados dela
//A stream de Writable só conseguimos escrever dados para ela
//A stream de Transform ela obrigatoriamente precisa ler dados de algum lugar
//e também precisa escrever dados para outro lugar, ela é uma stream de intermeio
//utilizada para comunicação de duas outras streams 

//Buffer: transicionar dados entre streams

//Stream Duplex: Ela pode ter tanto o método de leitura(_read) quanto o método
//de escrita(_write) ou seja ela pode fazer qualquer tipo de operação, tanto leitura
//quanto escrita.
//Uma stream duplex por exemplo pode ser um arquivo físico do nosso sistema, nós
//podemos ler e escrever nele, mas não podemos editar(transform)
