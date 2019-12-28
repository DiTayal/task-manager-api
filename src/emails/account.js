const sgmail=require('@sendgrid/mail')
//npm i @sendgrid/mail

//const sendGridAPIKey='';

//sgmail.setApiKey(sendGridAPIKey);
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail=(email,name)=>{//it is async functoin---see video 3 mod-15
    sgmail.send({
    
        from:'dishikatayal0407@gmail.com',
        to:email,
        subject:'Welcome to our Task App',
        text:`Hello ${name}. Thanks for joining in. We are excited to know, how you get along the app.`//${} syntax works only in this tilted quotes...
    })
}

const sendCancelEmail=(email,name)=>{
    sgmail.send({
        from:'dishikatayal0407@gmail.com',
        to:email,
        subject:`Sorry to see you go!`,
        text:`Good Bye ${name}.Kindly do let us know, what we could  have done to keep you more dear ${name}. Hope to see you back sometime soon. `
    })
}
module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}