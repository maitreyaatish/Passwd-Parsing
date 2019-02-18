var fs = require('fs')
var parse = require('parse-passwd'); //parse-passwd module for node.js (https://www.npmjs.com/package/parse-passwd)
let gids1 = new Map() //Map to match the group id's from /etc/groups file to /etc/passwd file
let final = {} 
if (!fs.existsSync('/etc/passwd') || !fs.existsSync('/etc/group')) {
    console.log("files do not exsist")
    throw new Error('Files do not exsist.Please change the arguments to point to the /etc/passwd and /etc/group files');
}
let passwd_file_contents = parse(fs.readFileSync('/etc/passwd', 'utf8'))  //Parsing passwd file
let group_file_contents = parse(fs.readFileSync('/etc/group', 'utf8'))  //Parsing group file with the same module for simplicity of the code. The key's will be different in the output
passwd_file_contents.forEach(function(n){ // Creating intermediate subarrays and pusing them into the main array that will be returned
  let temp = {}
  temp['uid'] = n['uid']
  temp['full_name']= n['gecos']
  temp['groups'] = ''
  gids1.set(n['gid'],n['username'])
  final[n['username']] = temp
})
group_file_contents.forEach(function(n){ //Getting groups by matching group id's with those form the passwd file
  if(gids1.has(n['uid'])){ //here beacuse the parse-passwd module isn't made for the group file the mappings are different so you'll get gid in userid and henceforth
    let uname = gids1.get(n['uid'])
    final[uname]['groups'] = n['gid'].split(',')
  }
})

var final_result = JSON.stringify(final);  //Convert map to JSON
console.log(final_result)