import userModel from '../models/user.js'
import agentModel from '../models/agent.js'

async function register(req, res){
    let existsUser = false;
    const {email, password, cfrmPassword} = req.body; 
    await userModel.findOne({email : email}).
    then(result => {
        if(result.email === email)
            existsUser = true;
    }).
    catch(err => {
        console.error(err);
    });

    if(existsUser){
        res.redirect('login.html');
    }
    else if(password === cfrmPassword){
        const user = new userModel({
            email : email,
            password : password
        });

        await user.save();
        res.redirect('login.html');
    }
    else{
        res.send("password doesn't matches");
    }
}

async function login(req, res) {
  const { email, password, isAgent } = req.body;
  req.session.isAgent = isAgent;
  if(!isAgent)
  {
    await userModel
    .findOne({ email: email })
    .then((result) => {
      if (result.email === email && result.password === password) {
        req.session.userEmail = email;
        res.redirect("/");
      } 
      else 
        res.redirect("login.html");
    })
    .catch((err) => {
      console.error(err);
      res.redirect("login.html");
    });
  }
  else{
    await agentModel
    .findOne({ email : email})
    .then( result => {   
      if(result.email === email && result.password === password){
        req.session.userEmail = email;
        res.redirect("/");
      }
      else
        res.redirect("login.html");
    })
    .catch( err => {
      console.error(err);
      res.redirect("login.html");
    })
  }
}

async function logout(req, res) {
  if(req.session.userEmail){
      req.session.destroy();
      res.json({status : false});
    }
}

export {register, login, logout};