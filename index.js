let i = 0

const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const fs = require('fs');
const app = express();

    // go to next page every loop
    const url = "https://mhrise.kiranico.com/data/armors?view="+i
    //url 0 = rarity 1, thats why i++ is after url but before the file naming
    i++

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const armorPieces = []

            $('tr', html).each(function() {
                const title = $(this).find('a').eq('0').text();

                // kiranico uses images for slots so to scrape the slot data, you look in the image url for "deco#"
                const slot1 = slotRegEx($(this).find('img').eq('4').attr('src'))
                const slot2 = slotRegEx($(this).find('img').eq('3').attr('src'))
                const slot3 = slotRegEx($(this).find('img').eq('2').attr('src'))

                function slotRegEx(string) {
                    //this function uses regex to find and use the deco# then output "Slot Lv #"
                    //if it finds a url without "deco" in it it will return ""
                    const reg = string.replace(/\S*(deco)([0-4]).*/g, "Slot Lv $2" )
                    if (reg.length < 20) {
                        return reg
                    } else {
                        return ""
                    }
                };

                const defence = $(this).find('div').eq('0').text();
                const fireRes = "Fire: " + resistanceRegEx($(this).find('div').eq('1').text())
                const waterRes = "Water: " + resistanceRegEx($(this).find('div').eq('2').text())
                const iceRes = "Ice: " + resistanceRegEx($(this).find('div').eq('4').text())
                const lightningRes = "Lightning: " + resistanceRegEx($(this).find('div').eq('3').text())
                const dragonRes = "Dragon: " + resistanceRegEx($(this).find('div').eq('5').text())

                function resistanceRegEx(string) {
                    // normally the res values come out like "\n  \n    \n  \n    4\n\n',"
                    // this function cleans that up a bit
                    return string.replace(/\s*(-?[0-999])\s*/g, "$1")
                }


                const skill1 = grabSkill($(this).find('div').eq('6').text());
                const skill1Lv = grabSkillLv($(this).find('div').eq('6').text());

                const skill2 = grabSkill($(this).find('div').eq('7').text());
                const skill2Lv = grabSkillLv($(this).find('div').eq('7').text());

                const skill3 = grabSkill($(this).find('div').eq('8').text());
                const skill3Lv = grabSkillLv($(this).find('div').eq('8').text());

                const skill4 = grabSkill($(this).find('div').eq('9').text());
                const skill4Lv = grabSkillLv($(this).find('div').eq('9').text());

                const skill5 = grabSkill($(this).find('div').eq('10').text());
                const skill5Lv = grabSkillLv($(this).find('div').eq('10').text());

                // Skill comes out like Weakness Exploit Lv 1
                // these separate the skill name and value into separate varables
                function grabSkill(string) {
                    return string.replace(/(.*)(.Lv.[1-9])/g, "$1")
                }

                function grabSkillLv(string) {
                    return string.replace(/(.*)(Lv.[1-9])/g, "$2")
                }


                const kiranicoURL = $(this).find('a').attr('href');

                armorPieces.push({
                    title,
                    slots: [
                        slot1,
                        slot2,
                        slot3 
                    ],
                    defences: [
                        defence,
                        fireRes,
                        waterRes,
                        iceRes,
                        lightningRes,
                        dragonRes 
                    ],
                    skills: [
                        skill1,
                        skill1Lv,
                        skill2,
                        skill2Lv,
                        skill3,
                        skill3Lv,
                        skill4,
                        skill4Lv,
                        skill5,
                        skill5Lv
                    ],
                    kiranicoURL,
                });

            })

            // data is in a nice array, but node.writeFile wants me to stringify it and make it ugly
            fs.writeFile("./data/rarity"+i+".json", JSON.stringify(armorPieces), { flag: 'wx' }, function (err) {
                if (err) throw err;
                console.log("It's saved!");
            });
            // to read it you can parse the json and make it all better
            let data = fs.readFileSync("./data/rarity"+i+".json");
            data = JSON.parse(data);
            // console.log(data);

        }).catch(err => console.log(err))


// app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`))
