# books-search-app
Node.js app to search books on gutenberg Project

This app is an implementation of node.js 8 the right way book by jim wilson, that can be found here https://pragprog.com/titles/jwnode2/#resources

it's built with express.js, elasticsearch, and typescript and webpack.


file lib/bundle.js has the core REST API to connect with elasticsearch.

# Thoughts on rebuilding and running this app.


Initially when I found this codebase I thought it would save time in helping build another books application that implements goodreads API with several different original  features I had in my mind, that doesn't exist in any currently available book search application. 

However I later found that this codebase is useful in exploring node.js asynchronous functionality and testing different db connections, exploring mocha and chai BDD style for data processing but  this setup is not useful for production.

The entire App when it is running on a local host will take up to 5GB of space or more, and this is only for one main functionality : searching through a high volume of books (over 60,000 books) and adding them into lists ,the app is fast and has deceptively simple UI.


I enjoyed the time I spent working with this codebase but the greatest lesson I learned from this is for anything to function beyond these features 
<ul>
<li>Searching data through DB with the above described volume </li>
  <li>Connecting and authenticating one user through social media ( using passport.js API’s)</li>
  <li>Adding, deleting,modifying lists of data</li>
  </ul>
,<b> Thinking about architecture that is production-ready is extremely important</b>,
<p>which requires proper estimating of number of users, number of data they will be adding, and potential new features added in the future,this would need a different kind of attention to different problems beyond functioning in a development environment.</p>

# additional notes 
also this codebase is written based on the older elasticsearch version 5.2 , not the current version 7.9 which has different syntax requirements, it is something to keep in mind for anyone attempting to work with it. 

Another thing to consider is to run ELK stack instead of elasticsearch only, Kibana offer good visualization <a href="https://www.digitalocean.com/community/tutorials/how-to-install-elasticsearch-logstash-and-kibana-elk-stack-on-ubuntu-14-04">  this is a good article to start ELK stack implementation for anyone interested</a>


