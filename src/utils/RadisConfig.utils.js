const Redis=require('ioredis')
const radisClient=()=>{
    if(process.env.RADIS_URL){
        console.log('Radis Connected')
        return process.env.RADIS_URL
    }
    throw new  Error('Radis connection failed.')
}

const radis=new Redis(radisClient())
module.exports=radis