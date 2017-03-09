var express = require('express');
var router = express.Router();
var passport = require('passport');
var powerbi = require('powerbi-api');
var msrest = require('ms-rest');

var workspaceCollection = '<Power BI Embedded Workspace Collection>';
var appKey = '<PBIE AppKey>';
var workspaceId = '<PBIE Workspace ID>';
var reportId = '<PBIE Report ID>';


var credentials = new msrest.TokenCredentials(appKey, "AppKey");
var client = new powerbi.PowerBIClient(credentials);

/* Render the login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'PBIE Login', error: req.flash('error')[0] });
});

/* Render the Home page (Ensures the user is logged in) */
router.get('/', function(req, res) {
  if(!req || !req.user){
    return res.redirect('/login');
  }
  var pbiReport = client.reports.getReports(workspaceCollection, workspaceId, function(err, result) {
    if(err) {
        throw err;
    }
    
    var token = powerbi.PowerBIToken.createReportEmbedToken(workspaceCollection, workspaceId, reportId, req.user[3].value, 'Customer');
    var jwt = token.generate(appKey);

    var rep = result.value.filter(function(report){
        return report.id === reportId;
    });
        
        var report = rep[0];
        res.render('index', 
            { title: 'PBIE Sample - Home', 
                user: req.user,
                pbiReportDetails: {report, jwt}
            });
   });
});

/* Handles the Passport login functionality. */
router.post('/login',
  passport.authenticate('local-login', {session: true, failureRedirect: '/login', failureFlash: true}),
  function(req, res){
      //console.log(req.user)
      res.redirect('/');
  });
 
/* Logout the user, then redirect to the login page. */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
