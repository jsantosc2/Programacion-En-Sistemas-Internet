import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
const client = new MongoClient();
client.connectWithUri("mongodb+srv://JuanSan:agugutata@cluster0.e0vqg.gcp.mongodb.net/Practica1?retryWrites=true&w=majority");
const db = client.database("Practica1");

interface CharacterSchema {
    _id: { $oid: string };
    id: number,
    name:string,
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: number,
    location: number,
    image: string,
    episode: number[],
  }
  
  interface LocationSchema {
    _id: { $oid: string };
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: number[];
  }
  
  interface EpisodeSchema {
    _id: { $oid: string };
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: number[];
  }
const charactersCollection = db.collection<CharacterSchema>("CharactersCollection");
const episodesCollection = db.collection<EpisodeSchema>("EpisodesCollection");
const locationsCollection = db.collection<LocationSchema>("LocationsCollection");

const Episodios = await episodesCollection.find()
const Localizaciones = await locationsCollection.find()
const InfoPersonaje2= await charactersCollection.find()

const NumToStr=(ep:any):string=>{
    let c=""
    Episodios.forEach((Episo:any):any=>{
        if(ep===Episo["id"]){
             c= Episo["name"]         
        }
      })
      return c
}

const ModificarPersonajes =  InfoPersonaje2.map((character)=>{
    return {
        ...character,
        origin : String(character.origin as Number),
        location : String(character.location as Number),
        episode: (character.episode as number[]).map(ep => String(NumToStr(ep))),
      }
})

ModificarPersonajes.forEach((f)=>{
    Localizaciones.forEach((elem)=>{
        let x = f.origin;
        let y:number = +x;
        if(y===elem["id"]){
            f.origin=elem.name
        }
        x = f.location;
        y = +x;
        if(y===elem["id"]){
            f.location=elem.name
        }
    })
})


const InfoPersonaje=async(ctx:any)=>{
    ctx.response.body= ModificarPersonajes

}

const port = 8000;
const app = new Application();
 
const router = new Router();
 
router.get('/Per', InfoPersonaje);
 
 
app.use(router.allowedMethods());
app.use(router.routes());
 
app.addEventListener('listen', () => {
  console.log(`Listening on: localhost:${port}`);
});
 
await app.listen({ port });