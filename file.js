const fs = require("fs");
const os = require("os");

// read files
fs.readFile("./docs/blog1.txt", (err, data) => {
  if (err) {
    console.error(err);
  }
  console.log(data.toString());
});

//write files
fs.writeFile("./docs/blog2.txt", "A new blog for writing", (err) => {
  if (err) {
    console.log(err);
  }
  console.log("file written");
});

//directory
if (!fs.existsSync("./docs/assets")) {
  fs.mkdir("./docs/assets", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Directory created");
  });
} else {
  fs.rmdir("./docs/assets", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Directory deleted");
  });
}

//console.log(os)


//delete files
fs.unlink("./docs/bo.txt", (err) => {
    if(err) {
        console.log(err);
    }
    console.log("File deleted");
})