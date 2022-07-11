const { Telegraf } = require('telegraf')
const data = require('../data.json');
const makeHandler = require('lambda-request-handler')

const BASE_PATH =
  process.env.VERCEL_ENV === 'production'
    ? 'https://nalan-test-app.vercel.app'
    : 'https://4636-157-49-251-183.in.ngrok.io';

const token = process.env.TELEGRAM_TOKEN
if (token === undefined) {
  throw new Error('TELEGRAM_TOKEN must be provided!')
}

const bot = new Telegraf(token, {
  telegram: { webhookReply: true }
});


const startFn = (ctx) => {
  console.log(ctx.from);
  ctx.replyWithHTML(`வணக்கம் ${ctx.from.first_name}! நலன் இயலிக்கு உங்களை வரவேற்கிறோம். மக்களுக்காக அரசு இயற்றும் திட்டங்களை எளிய முறையில் மக்களுக்கு கொண்டு செல்வதே இந்த இயலியின் நோக்கம். சில எளிய கேள்விகளுக்குப் பதிலளிப்பதன் மூலம் அரசு உங்களுக்கு எவ்வாறு உதவும் எனத் தெரிந்து கொள்ளலாம்.\n\n [1/5] பயனாளியின் வகையைத் தேர்வு செய்யவும்`, {
    reply_markup: {
      inline_keyboard: [
        [{
          text: "மாணவர்",
          callback_data: 'student'
        }], [{
          text: "விவசாயி",
          callback_data: 'farmer'
        }], [{
          text: "மாற்றுத்திறனாளி",
          callback_data: 'differently_abled'
        }],
        [{
          text: "தொழில் முனைவோர்",
          callback_data: 'entrepreneur'
        }],
        [{
          text: "மகளிர்",
          callback_data: 'women'
        }],
        [{
          text: "முதியோர்",
          callback_data: 'senior_citizen'
        }],
        [{
          text: "மேற்கண்ட எதுவும் இல்லை",
          callback_data: 'none_of_the_above'
        }],
      ]
    }
  });
};

bot.telegram.setWebhook(`${BASE_PATH}/api/webhook`);
bot.start(startFn);

// const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

module.exports = async (req, res) => {
  try {
    console.log('request received', req.body);
    let gender;
    let catogery;
    let community;
    let isStudent = false;
    let isSchoolStudent = false;
    let isCollegeStudent = false;
    let isFarmer = false;
    let isDifferentlyAbled = false;
    let isEntrepreneur = false;
    let isWomen = false;
    let isSeniorCitizen = false;
    let isNoneOfTheAbove = false;
    let income = null;
    let age = null;

    const greetingGender = {
      male: "சகோதரா",
      female: "சகோதரி",
      transgender: "சகோ"
    };

    const catogeryFn = (ctx) => {
      catogery = ctx.update.callback_query.data;
    // let greet = greetingGender[catogery] || ''
      ctx.replyWithHTML(`\n\n [2/5] பயனாளியின் பாலினத்தை தேர்வு செய்யவும்`, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "ஆண்",
              callback_data: 'male'
            }], [{
              text: "பெண்",
              callback_data: 'female'
            }], [{
              text: "மூன்றாம் பாலினம்",
              callback_data: 'transgender'
            }],
          ]
        }
      });
    };


    const genderFn = (ctx) => {
      gender = ctx.update.callback_query.data;
      let greet = greetingGender[gender] || ''
      bot.telegram.sendMessage(ctx.chat.id, `[2/5] நன்றி ${greet}! பயனாளி எந்த சமூகத்தைச் சேர்ந்தவர்? பின்வரும் ஒன்றைத் தேர்ந்தெடுக்கவும்.`, {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "OC/FC",
              callback_data: 'OC'
            }], [{
              text: "BC",
              callback_data: 'BC'
            }], [{
              text: "MBC",
              callback_data: 'MBC'
            }], [{
              text: "DNC",
              callback_data: 'DNC'
            }], [{
              text: "SC",
              callback_data: 'SC'
            }], [{
              text: "ST",
              callback_data: 'ST'
            }],
          ]
        }
      });
    };

    const communityFn = (ctx) => {
      community = ctx.update.callback_query.data;
      bot.telegram.sendMessage(ctx.chat.id, '[3/5] பின்வருவனற்றுள் எது பயனாளியைக் குறிக்கும்?', {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "பள்ளி மாணவர் (1ம் வகுப்பு - 12ம் வகுப்பு)",
              callback_data: "schoolStudent"
            }], [{
              text: "கல்லூரி மாணவர் (பட்ட/பட்டய/தொழிற்கல்வி/முனைவர் படிப்பு)",
              callback_data: "collegeStudent"
            }]
          ]
        }
      });
    };

    const studentFn = async (ctx) => {
      isSchoolStudent = ctx.update.callback_query.data === 'schoolStudent';
      isCollegeStudent = ctx.update.callback_query.data === 'collegeStudent';
      isStudent = isSchoolStudent || isCollegeStudent;
      if (!isStudent) {
        bot.telegram.sendMessage(ctx.chat.id, '[4/5] பயனாளியின் வயது என்ன?', {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "30 அல்லது அதற்கும் கீழ்",
                callback_data: "30"
              }], [{
                text: "31-40",
                callback_data: "40"
              }], [{
                text: "41-50",
                callback_data: "50"
              }], [{
                text: "51-60",
                callback_data: "60"
              }],  [{
                text: "61-70",
                callback_data: "70"
              }], [{
                text: "71-80",
                callback_data: "80"
              }], [{
                text: "81-90",
                callback_data: "90"
              }], [{
                text: "100 அல்லது அதற்கும் மேல்",
                callback_data: "100"
              }]
            ]
          }
        });
      } else {
        await sendFinalResultFn(ctx);
      }
    };

    const farmerFn = async (ctx) => {
      isFarmer = true;

      bot.telegram.sendMessage(ctx.chat.id, '[2/2] பயனாளியின் தேவை என்ன?', {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "விதை",
              callback_data: "seeds"
            }], [{
              text: "உபகரணம்",
              callback_data: "tools"
            }], [{
              text: "கால்நடை",
              callback_data: "cattle"
            }], [{
              text: "உரம்",
              callback_data: "fertilizer"
            }],  [{
              text: "சிறுதானியம்",
              callback_data: "small_grain"
            }]
          ]
        }
      });
    };

    const farmerNeedOptions = async (ctx) => {
      farmerNeeds =  ctx.update.callback_query.data;
      const schemes = data.filter((item) => {
        if (item.isFarmer === true && item.farmerNeeds.includes(farmerNeeds)) {
          return true;
        } else {
          return false;
        }
      });

      if (schemes.length) {
        const messagesArray = [];
        let firstMessage = 'பதிலளித்தமைக்கு நன்றி.\n';
        firstMessage += '===============================\n\n';
        messagesArray.push(firstMessage);
        let message = '';
        schemes.forEach((scheme, index) => {
          let benefits = '';
          let education = '';
          let description = '';
          let url = '';
          let religion = '';
          let maxIncome = '';
          scheme.benefits?.forEach((benefit) => {
            benefits += `<b>-</b> ${benefit.criteria? benefit.criteria: ''} ${benefit.amount || ''}\n`
          });

          let eligibility = '';
          if (scheme.eligibility) {
            eligibility = '<b>இதர தகுதி</b>:\n';
            scheme.eligibility?.forEach((elig) => {
              eligibility += `<b>*</b> ${elig.value}\n`;
            });
          }

          if (scheme.education) {
            education = `<b>கல்வித் தகுதி</b>: ${scheme.education}\n`;
          }

          if (scheme.religion && scheme.religion.length) {
            religion = `<b>பயனாளி பின்வரும் மதத்தைச் சார்ந்தவராக இருக்க வேண்டும்</b>: ${scheme.religion.map(i => i)}\n`;
          }

          if (scheme.description) {
            description = `<b>திட்டக்குறிப்பு</b>: ${scheme.description}\n\n`;
          }

          if (scheme.maxIncome) {
            maxIncome = `<b>பயனாளி குடும்பத்தின் அதிகபட்ச ஆண்டு வருமானம்</b>: ரூ${scheme.maxIncome}\n`;
          }

          if (scheme.url) {
            url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
          }
          let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
          currentMessage += '===============================\n\n';

          if ((message+currentMessage).length >= 4096) {
            messagesArray.push(message);
            message = currentMessage;
          } else {
            message += currentMessage;
          }
        });

        messagesArray.push(message);

        for (let mess of messagesArray) {
          await ctx.replyWithHTML(mess);
        }
        await ctx.replyWithHTML(`மேலே குறிப்பிட்டுள்ள ${schemes.length} திட்டங்கள் உங்களுக்கு பயனுள்ளவையாக இருக்கலாம். மேலதிக தகவல்களுக்கு அருகிலுள்ள மாவட்ட ஆட்சியர் அலுவலகத்தை அணுகவும். இந்த சேவையை மீண்டும் தொடங்க கீழுள்ள பொத்தானை தட்டவும்.`, {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "மீண்டும் தொடங்கு",
                callback_data: 'start'
              }
            ]]
          }
        });
      } else {
        await bot.telegram.sendMessage(ctx.chat.id, 'மன்னிக்கவும். நீங்கள் கொடுத்த தகவலுக்கு ஏற்ற அரசு நலத் திட்டங்கள் பற்றிய விவரங்கள் எங்களிடம் இல்லை. உங்கள் மாவட்ட ஆட்சியர் அலுவலகத்தை அணுகவும்.', {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "மீண்டும் தொடங்கு",
                callback_data: 'start'
              }
            ]]
          }
        });
      }
    }

    const ageFn = (ctx) => {
      age = ctx.update.callback_query.data;
      bot.telegram.sendMessage(ctx.chat.id, '[5/5] உங்கள் குடும்பத்தின் அதிகபட்ச ஆண்டு வருமானம் என்ன என்ன?', {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "12,000 க்கு கீழ்",
              callback_data: "12000"
            }], [{
              text: "12,001 - 24,000",
              callback_data: "24000"
            }], [{
              text: "24,001 - 36,000",
              callback_data: "36000"
            }], [{
              text: "36,001 - 48,000",
              callback_data: "48000"
            }], [{
              text: "48,001 - 60,000",
              callback_data: "60000"
            }], [{
              text: "60,001 - 72,000",
              callback_data: "72000"
            }], [{
              text: "72,001 - 84,000",
              callback_data: "84000"
            }], [{
              text: "84,001 - 96,000",
              callback_data: "96000"
            }], [{
              text: "96,001 க்கு மேல்",
              callback_data: "100000"
            }]
          ]
        }
      });
    };

    const incomeFn = async (ctx) => {
      income = ctx.update.callback_query.data;
      await sendFinalResultFn(ctx);
    };

    const sendFinalResultFn = async (ctx) => {
      console.log('user input', gender, community, isSchoolStudent, isCollegeStudent, age, income);
      const schemes = data.filter((item) => {
        if (isStudent) {
          if (isSchoolStudent) {
            if (
              (item.isSchoolStudent === isSchoolStudent) &&
              (item.gender === null || item.gender?.includes(gender)) &&
              (item.community === null || item.community?.includes(community)) &&
              (item.minIncome === null || item.maxIncome === null || item.minIncome <= income || item.maxIncome >= income)
              ) {
              return true;
            } else {
              return false;
            }
          } else {
            if (
              (item.isCollegeStudent === isCollegeStudent) &&
              (item.gender === null || item.gender?.includes(gender)) &&
              (item.community === null || item.community?.includes(community)) &&
              (item.minIncome === null || item.maxIncome === null || item.minIncome <= income || item.maxIncome >= income)
              ) {
              return true;
            } else {
              return false;
            }
          }
        }
        if (
          (item.isSchoolStudent === isSchoolStudent) &&
          (item.isCollegeStudent === isCollegeStudent) &&
          (item.gender === null || item.gender?.includes(gender)) &&
          (item.community === null || item.community?.includes(community)) &&
          ((item.minAge === null && item.maxAge === null) || (item.minAge?  item.minAge >= age : item.maxAge <= age)) &&
          (item.maxIncome === null || item.maxIncome >= income)
          ) {
          return true;
        } else {
          return false;
        }
      });
      console.log('schemes is ', schemes);

      if (schemes.length) {
        const messagesArray = [];
        let firstMessage = 'பதிலளித்தமைக்கு நன்றி.\n';
        firstMessage += '===============================\n\n';
        messagesArray.push(firstMessage);
        let message = '';
        schemes.forEach((scheme, index) => {
          let benefits = '';
          let education = '';
          let description = '';
          let url = '';
          let religion = '';
          let maxIncome = '';
          scheme.benefits?.forEach((benefit) => {
            benefits += `<b>-</b> ${benefit.criteria? benefit.criteria: ''} ${benefit.amount || ''}\n`
          });

          let eligibility = '';
          if (scheme.eligibility) {
            eligibility = '<b>இதர தகுதி</b>:\n';
            scheme.eligibility?.forEach((elig) => {
              eligibility += `<b>*</b> ${elig.value}\n`;
            });
          }

          if (scheme.education) {
            education = `<b>கல்வித் தகுதி</b>: ${scheme.education}\n`;
          }

          if (scheme.religion && scheme.religion.length) {
            religion = `<b>பயனாளி பின்வரும் மதத்தைச் சார்ந்தவராக இருக்க வேண்டும்</b>: ${scheme.religion.map(i => i)}\n`;
          }

          if (scheme.description) {
            description = `<b>திட்டக்குறிப்பு</b>: ${scheme.description}\n\n`;
          }

          if (scheme.maxIncome) {
            maxIncome = `<b>பயனாளி குடும்பத்தின் அதிகபட்ச ஆண்டு வருமானம்</b>: ரூ${scheme.maxIncome}\n`;
          }

          if (scheme.url) {
            url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
          }
          let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
          currentMessage += '===============================\n\n';

          if ((message+currentMessage).length >= 4096) {
            messagesArray.push(message);
            message = currentMessage;
          } else {
            message += currentMessage;
          }
        });
        messagesArray.push(message);

        for (let mess of messagesArray) {
          await ctx.replyWithHTML(mess);
        }
        await ctx.replyWithHTML(`மேலே குறிப்பிட்டுள்ள ${schemes.length} திட்டங்கள் உங்களுக்கு பயனுள்ளவையாக இருக்கலாம். மேலதிக தகவல்களுக்கு அருகிலுள்ள மாவட்ட ஆட்சியர் அலுவலகத்தை அணுகவும். இந்த சேவையை மீண்டும் தொடங்க கீழுள்ள பொத்தானை தட்டவும்.`, {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "மீண்டும் தொடங்கு",
                callback_data: 'start'
              }
            ]]
          }
        });
      } else {
        await bot.telegram.sendMessage(ctx.chat.id, 'மன்னிக்கவும். நீங்கள் கொடுத்த தகவலுக்கு ஏற்ற அரசு நலத் திட்டங்கள் பற்றிய விவரங்கள் எங்களிடம் இல்லை. உங்கள் மாவட்ட ஆட்சியர் அலுவலகத்தை அணுகவும்.', {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "மீண்டும் தொடங்கு",
                callback_data: 'start'
              }
            ]]
          }
        });
      }
    }

    bot.command('start', startFn);

    bot.on('text', startFn);
    bot.on('message', startFn);
    bot.action('start', startFn);

    bot.action('male', genderFn);
    bot.action('female', genderFn);
    bot.action('transgender', genderFn);

    bot.action('farmer', farmerFn);

    bot.action('seeds', farmerNeedOptions);
    bot.action('fertilizer', farmerNeedOptions);
    //TODO: Add remaining options

    bot.action('OC', communityFn);
    bot.action('BC', communityFn);
    bot.action('MBC', communityFn);
    bot.action('SC', communityFn);
    bot.action('ST', communityFn);

    bot.action('schoolStudent', studentFn);
    bot.action('collegeStudent', studentFn);
    bot.action('non-student', studentFn);

    ["30", "40", "50", "60", "70", "80", "90", "100"].forEach((inc) => {
      bot.action(inc, ageFn);
    });

    ["12000", "24000", "36000", "48000", "60000", "72000", "84000", "96000", "100000"].forEach((inc) => {
      bot.action(inc, incomeFn);
    });

    await bot.handleUpdate(req.body);
  } catch (error) {
    console.log(error);
  }
  res.send('OK');
}