import dotenv from "dotenv"
import cors from "cors"
import express, { json } from "express"
import { MongoClient } from "mongodb"

async function server() {
    
    dotenv.config()
    const PORT = process.env.PORT;
    const BANCO = process.env.BANCO;
    let db;
    
    const app = express();
    app.use(json());
    app.use(cors());
    
    const mongoClient = new MongoClient(BANCO);
    try{
        await mongoClient.connect();
        db = mongoClient.db('teste')
        console.log('banco conectado');
    }catch(e){
        console.log("Erro ao conectar banco: ", e)
    }

    
    app.post("/clients", async (req, res) => {
        const { body: dados } = req
        try{
            db.collection("clients").insertOne(dados)
            console.log("dados salvos com sucesso")
            return res.sendStatus(200)

        }catch(e){
            console.log('Erro ao salvar dados do cliente: ', e)
            return res.sendStatus(400)
        }
    })

    app.get("/clients", async (req, res)=>{
        try{
            const dadosClientes = await db.collection("clients").find({}).toArray()
            console.log("dados dos clientes enviados")
            return res.send(dadosClientes)
        }catch(e){
            console.log("erro ao buscar dados doss clientes: ", e)
            return res.sendStatus(404)
        }
    })



    app.listen(PORT || 5000, () => console.log("Servidor on"))

}

server()