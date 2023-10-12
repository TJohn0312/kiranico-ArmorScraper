# kiranico-ArmorScraper
the data is stored as stringified JSON in data/

this can be easily be parsed to help retrieve data. Ex:
```javascript
            let data = fs.readFileSync("./data/rarity10.json");
            data = JSON.parse(data);
            console.log(data);
```

to re-run the scraper cd to kiranico-ArmorScraper/ and run
```bash
npm i
node index.js
```
however I could not get a while loop working (somthing about Axios being asynchronous) 

I retrieved this data by running node index, then manyally incrementing the value of i from 0 to 9
re-runing node index.js each time
