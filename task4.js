/*Hi Coach Moones, this is my solution for task 4,
 and I wrote a small comment before every function to clear my thinking type*/

 const post = {
    p1: {
      id: "p1",
      author: { name: "Mira", email: "mira@trendpulse.dev", verified: true },
      content: "Meet @sara at the hub #js #async",
      engagement: { likes: 12, shares: 2, comments: 4 },
      createdAt: "2026-04-01T09:00:00.000Z"
    },
    p2: {
      id: "p2",
      author: { name: "Rami", email: "invalid-email", verified: false },
      content: "Checkout #node tutorials",
      engagement: { likes: 3 },
      createdAt: "2026-04-02T11:30:00.000Z"
    }
  };

//1) Rich post model

// Just implementing exactly what was asked step by step:
// Merge the post using spread
// Use destructuring to  read `author.name`
// Count the keys on the merged object
// This is a direct application of instructions 

function describePostForUi(post) {
    const { author: { name: authorName } } = post;
    const mergedPost = {  ...post, meta: { channel: "web" } };
    const keysCount = Object.entries(mergedPost).length;
    return{
        title: post.id,
        authorName,
        keysCount
        }
    }

//console.log(describePostForUi(post.p1));



//2) Safe nested reads

// Just following the instructions:
// Safely read likes, shares, comments from engagement
// by provide 0 as default if any value is missing
// using `??` for defaults (0) and `?.` for missing `engagement.` 

function getEngagementTotals(post) {
     return { likes:post.engagement?.likes?? 0, 
              shares:post.engagement?.shares?? 0,
              comments: post.engagement?.comments?? 0
             } 
  }
  const x = { engagement: { likes: 5, shares: 1 } };
  const y = { engagement: { likes: 2 } };
/*
  console.log(getEngagementTotals(x));
  console.log(getEngagementTotals(y));
*/



//3) Simulated async fetch

// Simulate async fetching using Promise, setTimeout
// If the id exists, resolve with a copy of the post
// If not,  reject with "NOT_FOUND"

function fetchPostById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (post[id]) {
            resolve({ ...post[id] })
          } else {
            reject("NOT_FOUND");
          }
      }, 30);
    });
  }
  // Using async/await with try/catch/finally to handle the Promise
  async function demoFetch(id) {
    try {
      const post = await fetchPostById(id); // wait for async result
      console.log("Post found:", post);  // runs if promise resolves
    } catch (e) {
        console.log("Error:", e); // runs if promise rejects
    } finally {
        console.log("done"); // always runs (success or error)
    }
  }
// Even though the calls are written one after another,
// they run asynchronously ,
// so each one handles its own result independently

/*
demoFetch("p1"); // post exists:  success, prints post , print "done"
demoFetch("p999"); //  not found: error,  prints "Error: NOT_FOUND", print "done"
*/



//4) Regex: email, hashtags, mentions  
const emailOk = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
const hashTag = /#[\w؀-ۿ]+/g;
const mention = /@[\w]+/g;

function analyzePostText(post) {
   //Using .test() because we only need to validate the email
   //Using optional chaining (?.) in case author is missing
   const emailValid = emailOk.test(post.author?.email);
   //Using .match() to extract all hashtags and all mentions from the content using global regex
   const tags = post.content?.match(hashTag)|| [];
   const mentions = post.content?.match(mention)|| [];

   return { emailValid, tags, mentions}
   
}
/*
console.log(analyzePostText(post.p1));
console.log(analyzePostText(post.p2));
*/



//5) Event loop: predict order

// No code to write here, just understanding the execution order:
// Synchronous code runs first "1" then "4"
// Then microtasks (Promise) "3"
// Finally macrotasks (setTimeout)  "2"
// This behavior is controlled by the event loop

/*
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
*/



//6) Date format + live refresh timer

//Date format:
// I convert the ISO string into a Date object,
// then extract year, month, and day separately.
// I used padStart to make sure month and day are always 2 digits
// I return the formatted string as `YYYY-MM-DD`.
function formatIsoDateOnly(iso) {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

//live refresh timer:
// just understanding, using setInterval to simulate a refresh process that runs every 200ms.
// Each time,  increasing the counter and sending it to the callback (onTick).
// When the counter reaches 3, stop the interval using clearInterval.
function startRefreshDemo(onTick) {
  let n = 0;
  const id = setInterval(() => {
    n++;
    onTick(n);
    if (n >= 3) clearInterval(id);
  }, 200);
}

// Date test
/*
const iso = "2026-04-04T10:00:00.000Z";
console.log(formatIsoDateOnly(iso));
*/


// Timer test
// Passing a callback function to startRefreshDemo
// It logs the current tick value each time the interval runs
// It will stop automatically after 3 executions
/*
startRefreshDemo((n) => {
  console.log("Tick:", n);
});
*/



//7) Final orchestrator

async function runTrendPulsePhase2() {
  const ids = ["p1", "p2"];    //array of post IDs we want to fetch
  let loaded = 0;   //counter for posts successfully loaded
  let validEmails = 0;    //number of valid author emails
  let invalidAuthorId = null;     //the first post ID with an invalid email
  const datesFormatted = [];      //array of post dates formatted as YYYY-MM-DD

  // I loop through each id sequentially using for...of
  for (const id of ids) {
    try {
      // await fetchPostById ensures I get the post before moving to the next
      // loaded counts successfully fetched posts
      const post = await fetchPostById(id);
      loaded++; 

      // I use regex to check if the author's email is valid
      // invalidAuthorId stores only the first invalid email's id
      const emailValid = emailOk.test(post.author?.email);
      if (emailValid) validEmails++;
      else if (!invalidAuthorId) invalidAuthorId = id; 

      // datesFormatted collects all dates in YYYY-MM-DD
      datesFormatted.push(formatIsoDateOnly(post.createdAt));
     
    } 
    catch (err) {
      // if fetch fails, we just continue (could log error)
      console.log(`Post ${id} not found`);
    }
  }

  return { loaded, validEmails, invalidAuthorId, datesFormatted };
}

//runTrendPulsePhase2().then(summary => console.log(summary));