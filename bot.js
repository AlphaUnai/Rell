const{ REST } = require('@discordjs/rest');
const{ rosa } =require('./Objetos/rosa') ;
const { Player } = require("discord-player")
const { 
  Routes ,
  Client,
  GatewayIntentBits,
  IntentsBitField,
  Intents,
  MessageFlags,
  CommandInteractionOptionResolver,
  InteractionCollector, 
  ChannelType, 
  GuildChannel, 
  EmbedBuilder, 
  Options, 
  Message, 
  Colors } = require('discord.js');

const { token , clientId  } = require('./config.json');
const { joinVoiceChannel, 
  getVoiceConnection, 
  createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
  NoSubscriberBehavior,
} = require('@discordjs/voice');


const https = require('https');


const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]});

const player = new Player(client, {
    autoSelfDeaf: true,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 5,
    leaveOnEnd: false,
    leaveOnStop: false,
});
const rest= new REST({version: '10'}).setToken(token);

const play = require("play-dl");

let servers={}
let bendLink=""

client.player=player;
client.login(token);

//---------------------------------------------------------------------------
//https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object
//---------------------------------------------------------------------------



//Comandos
const comandos=[
  {
    name:'time',
    description: 'Te digo la fecha y hora',
  },
  {
    name:'pablomotos',
    description: 'Muestro un GIF de Pablo Motos',
  },
  {
    name:'clean',
    description: 'Limpia el canal',
  },
  {
    name:'help',
    description: 'Muestra ayuda',
  },
  {
    name:'registrar',
    description: 'Te registro en mi base de datos',
  },
  {
    name:'join',
    description:'Me uno a un canal de voz',
    
  },
  {
    name:'leave',
    description: 'Me salgo del canal',
  },
  {
    name:'per',
    description: 'Te enseño un personaje',
    options:[
      {
        name:'color',
        description:'personaje random de este color',
        type:3,
        required:'true',
        choices:[
          {
            name:'rosa',               
            value:'rosa'
          }
        ]
      }
    ]
  },
  {
    name:'user',
    description:'Muestra info de la persona',
    options:[
      {
        name:'user',
        description:' Usuario a mostrar ',
        type: 9,
        required: true,
      }
    ],
  },
  {
    name:'play',
    description:' Pone música en el canal en el que estés ',
    options:[
      {
        name:'link',
        description:' Link de la canción ',
        type: 3,
        required: true,
      }
    ],
  },
];



client.on('interactionCreate', async (itr)=>{
  try{

  
    const mapKey=itr.channel.guildId;
    if(itr.isChatInputCommand()){
      canal=itr.channel;
      nomCanal=itr.name;
      if(itr.commandName==='time'){
        
      var time= new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(new Date());
        itr.reply({
          content: "Estamos a "+time,
        })
      }
      if(itr.commandName==='per'){
        var url='https://i.imgur.com/lrtA2hp.gif';
        var col=itr.options.getString('color');
        let obj= rosa[Math.floor(Math.random() * rosa.length)];
        const embedMessage={
          title:obj.nombre,
          color: 3447003,
          image:{ 
            url:obj.url,
            height:200,
            width:200
          },
        };
        
        itr.reply({
          embeds: [embedMessage]
          
        })
      
      if(col=="rosa"){}
      else{
        console.log(itr.options.data[0]);
      /* itr.reply({
          embeds:[{title:col}]
        })*/

      }
      }
      if(itr.commandName==='pablomotos'){
        var url='https://i.imgur.com/lrtA2hp.gif';
        const embedMessage={
          title:"Pablo Motos",
          color: 3447003,
          image:{ 
            url:url,
            height:200,
            width:200
          },
        };
        itr.reply({
          embeds: [embedMessage]
        })
      }

      if(itr.commandName==='clean'){
        itr.channel.clone();
        let can= itr.guild.channels.cache.find(r=> r.name===nomCanal)
        itr.channel.delete();
        
      }

      if(itr.commandName==='help'){
        var str="";
        for(i=0;i<comandos.length;i++){
          str+="**/"+comandos[i].name+"** : "+comandos[i].description+"\n\n"
        }
        itr.reply({
          content:str
        })
      }
      //JOIN
      if(itr.commandName==='join'){
        if (!guildMap.has(mapKey))
          await connect(itr, mapKey,"https://youtu.be/0yqm7vrCp-g")
        else
          itr.reply({content:'Ya estoy conectado a un canal'})
      
      }
      //PLAY
      if(itr.commandName==="play"){
        let link1=""
          try{
            new URL(itr.options.getString('link'))
            link1=itr.options.getString('link')
           
          }catch(e){
            itr.reply({content:"Debes adjuntar un link válido"})
            return
          }
          if(!itr.member.voice.channelId){
            itr.reply({content:"Primero debes unirte a un canal de voz"})
            return
          }

          if(!servers[itr.guild.id]) servers[itr.guild.id] ={
            queue:[]
          }
          var server = servers[itr.guild.id];
          server.queue.push(itr.options.getString('link'));
          var yt_info = await play.video_info(itr.options.getString('link'))
          var title=yt_info.video_details.title
          itr.channel.send("Añadido **"+title+"** a la cola")
          let connec=""
          if(connec==""){  
            let connec=joinVoiceChannel({
            channelId:itr.member.voice.channelId,
            guildId:itr.guildId,
            selfDeaf:false,
            selfMute:false,
            adapterCreator:itr.guild.voiceAdapterCreator,
          })
          itr.reply({content:"Reproduciendo música en "+itr.channel})
          /**
           var server = servers[itr.guild.id];
            const player = createAudioPlayer();
            connec.subscribe(player);
            link= server.queue[0];
            const resource = createAudioResource( ytdl("https://youtu.be/BZP1rYjoBgI", {filter: "audioonly"}))
            console.log(resource)
           */
            let vuelta=0
          async function playMusic(){
            
            let args = server.queue[0];
            let stream = await play.stream(args)
            var yt_info = await play.video_info(args)
            var title=yt_info.video_details.title
            itr.channel.send("Reproduciendo **"+title+"** "+vuelta)
            let resource= createAudioResource(stream.stream, {inputType:stream.type})
            vuelta++
            return resource            
          }
          connec.on(VoiceConnectionStatus.Ready, async ()=>{
            
              var source=await playMusic()
              let player = createAudioPlayer({behaviors:{noSubscriber:NoSubscriberBehavior.Play}})
              player.play(source)
              connec.subscribe(player)
              player.on(AudioPlayerStatus.Idle, async() => {
              
              console.log(server.queue)
                server.queue.shift()
                if(server.queue[0]!=undefined){
                  var source=await playMusic()
                  player.play(source)
                } 
                else{ 
                  setTimeout(() => {
                    console.log(server.queue)
                    if(server.queue[0]==undefined){
                      
                      connec.disconnect()}
                  }, 10000);
                }
              
              
            });
        
          })
          
        }
          
      }
      //LEAVE
      if(itr.commandName==='leave'){
        var dc=getVoiceConnection(itr.guildId)
        
        
        
        if(dc===undefined){
          itr.reply({
            content:"No está conectado a ningun canal de voz",
          })
        }else {
          dc.disconnect();
          itr.reply({
            content:"Dc'ing",
          })
        }   
      }
      //USER
      if(itr.commandName==='user'){
        var user=itr.options.get('user').user;
        console.log();
        if(user===undefined){
          itr.reply({
            content:"Tienes que mencionar a alguien, no un rol",
          })
        }else{
          
          
          const embedMessage={
            title:user.username,
            color: 3447003,
            fields:[
              {name: 'Creado el ', value: new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(user.createdAt), inline: true },
              {name: 'Unido a '+itr.guild.name+' el ', value: new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(itr.guild.members.cache.get(user.id).joinedAt), inline: false },
            ],
            image:{ 
              url:user.avatarURL(),
              height:200,
              width:200
            },
          };
          
          itr.reply({
            embeds: [embedMessage]
            
          })
          
        }
      }
    }
  }catch(e){
    console.log('discordClient message: ' + e)
    itr.reply({content:'Error, algo a pasado, si el error perdura contacte al desarrollador'});
  }
})
//Comandos END


//---------------------------------------------------------------------------

client.on('ready', ()=>{
  console.log(`${client.user.tag} has logged in`);
    
});



client.on('messageCreate', (message)=>{
  let msg=message.content;
 // console.log(message.content);
  

  if(!isCommand(msg)){return}
  else{
    canal=message.channel;
    nomCanal=canal.name;
    let comm=msg.slice(1);
    //console.log(comm);
    if(comm==="time"){
      var time= new Date();
      canal.send("Estamos a "+time);
      guardarDatos('time')
    }
    else
    if(comm==="hola"){
      canal.send("!Hola "+message.author.username+"!");
    }
    else
    if(comm==="user"){
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric', minute:'numeric', second:'numeric'};
      canal.send("Este usuario fue creado en "+message.author.createdAt.toLocaleDateString("en-US",options)+", y se unió al servidor en "+message.member.joinedAt.toLocaleDateString("en-US",options));
    } 
    else
    if(comm==="higher"){
      canal.send('https://preview.redd.it/hlwjpj2v25k91.jpg?width=640&crop=smart&auto=webp&s=4bf630154ef1b3993f6e502019ccf0d6deeb0012');
    }
    else 
    if(comm==="clean"){
      message.channel.clone();
      let can= message.guild.channels.cache.find(r=> r.name===nomCanal)
      can.delete();
      console.log();
    }
    else
    if(comm==="flip"){
        canal.send("Ha salido "+flip()+ " :coin:");
    }else
    if(comm==="refresh"){
      main(message);
      canal.send("***Comandos registrados!***");
    }else{
    canal.send("Comando erróneo");
    }
    
}
});

//---------------------------------------------------------------------------

function flip(){
  if(Math.round(Math.random())==0){
    return "cara";
  }else{
    return "cruz";
  }
}



function isCommand(str){ 
   if(str.charAt(0)=='.'){return true}
   else{return false}
  
}

async function main(message){
  try{
    console.log('Comandos registrados para el servidor << '+ message.guild.name +' >>');
    
      await rest.put(Routes.applicationGuildCommands(clientId,message.guildId),{
        body:comandos,
      
  });
    
  }catch(err){console.log(err)}
}

//---------------------------------------------------------------------------



//---------------------------------------------------------------------------

//--------------------VOICE TRY--------------------------
async function convertAudio(input){
  try{//stereo a mono
    const data = new Int16Array(input);
    const ndata = new data.filter((el,idx)=> idx%2);
    return Buffer.from(ndata);
  }
  catch(e){
    console.log(e);
    console.log('convertAudio: '+e);
    throw e;
  }
}
const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

const { Readable } = require('stream');


class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}
const guildMap= new Map();

async function connect( itr , mapKey , link ){
  try{
    let vCanal= await itr.member.voice.channelId;
    if(!vCanal) return itr.reply({content: 'Error, no estas conectado a un canal de voz',})
    let tCanal= await itr.channel;
    let vConex= await joinVoiceChannel({
      channelId:vCanal,
      guildId:itr.guildId,
      selfDeaf:false,
      adapterCreator:itr.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    vConex.subscribe(player);
    const resource = createAudioResource(ytdl(link, {filter: "audioonly"}))
    player.play(resource);
    player.on(AudioPlayerStatus.Idle, () => {
      vConex.disconnect()
      guildMap.delete(mapKey);
    });
    guildMap.set(mapKey,{
      'tCanal':tCanal,
      'vCanal':vCanal,
      'vConex':vConex,
      'selectedLang':'es',
      'debug':false,
    })
    
    vConex.on('disconnect', async(e)=>{
      console.log("A");
      if(e) console.log(e);
      guildMap.delete(mapKey);
    })
    itr.reply({content:'Conectado!'})
  }catch (e){
    console.log('Connect: '+e);
    itr.reply({content:'Me ha sido imposible conectarme'});
    
  }
}

async function getSongInfo(link){
  let url=link;
  try{
    let res = await fetch("http://noembed.com/embed?url="+url+"&callback=my_embed_function")
    return await res.text();
  }catch(error){
    console.log(error)
  }
  
}

async function updateInfo(name,command ){
    https.request()
} 

