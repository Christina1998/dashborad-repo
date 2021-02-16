
//Signup 
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var uname= post.name;
      var uemail= post.email;
      var ucontact= post.contact;
      var urole= post.role;
      var pass= post.password;

      var sql = "INSERT INTO `users`(`name`,`email`,`contact`,`role`, `password`) VALUES ('" + uname + "','" + uemail + "','" + ucontact + "','" + urole + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Your account has been created successfully!";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//Login page 
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var uname= post.name;
      var pass= post.password;
     
      var sql="SELECT id, name, contact, role FROM `users` WHERE `name`='"+uname+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/dashboard');
         }
         else{
            message = 'Wrong Credentials. Username or Password is incorrect.';
            res.render('login.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('login.ejs',{message: message});
   }
           
};
        

//Logout 
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//Render user details after login
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
