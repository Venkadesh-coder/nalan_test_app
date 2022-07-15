const { Telegraf } = require('telegraf');
const data = require('../data.json');
const makeHandler = require('lambda-request-handler');

const BASE_PATH = process.env.VERCEL_ENV === 'production'
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
ctx.replyWithHTML(`வணக்கம் ${ctx.from.first_name}! நலன் இயலிக்கு உங்களை வரவேற்கிறோம். மக்களுக்காக அரசு இயற்றும் திட்டங்களை எளிய முறையில் மக்களுக்கு கொண்டு செல்வதே இந்த இயலியின் நோக்கம். சில எளிய கேள்விகளுக்குப் பதிலளிப்பதன் மூலம் அரசு உங்களுக்கு எவ்வாறு உதவும் எனத் தெரிந்து கொள்ளலாம்.\n\n [1/6] பயனாளியின் வகையைத் தேர்வு செய்யவும்`, {
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
        callback_data: 'DifferntlyAbled'
      }],
      [{
        text: "தொழில் முனைவோர்",
        callback_data: 'Entrepreneur'
      }],
      [{
        text: "மகளிர்",
        callback_data: 'Women'
      }],
      [{
        text: "முதியோர்",
        callback_data: 'SeniorCitizen'
      }],
      [{
        text: "மேற்கண்ட எதுவும் இல்லை",
        callback_data: 'NoneOfTheAbove'
      }]
    ]
  }
});
};

bot.telegram.setWebhook(`${BASE_PATH}/api/webhook`);
bot.start(startFn);

// const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

module.exports = async (req, res) => {
try{ 
  console.log('request received', req.body);
  let gender;
  let community;
 // let categoryStudent;
  let isStudent = false;
  let isSchoolStudent = false;
  let isCollegeStudent = false;
  let isNoneOfTheAbove = false;
  let isFisher= false;
  let isHandLoomWeavers= false;
  let isDeath= false;
  let isNonDeath= false;
  let isFarmer = false;
  let isWomen = false;
  let isWriter = false;
  let isJournalist = false; 
  let isEnterpreneur = false;     
  let isSeniorCitizen = false;
  let isDifferntlyAbled =  false;
  let income = null;
  let age = null;
  
  const greetingGender = {
    male: "சகோதரா",
    female: "சகோதரி",
    transgender: "சகோ"
  };

  const noneOfTheAboveFn = (ctx) => {
    console.log(ctx.from);
    isNoneOfTheAbove = true;
    bot.telegram.sendMessage(ctx.chat.id, '[1/6] பயனாளியின் வகையைத் தேர்வு செய்யவும்?', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: "மீனவர்",
            callback_data: 'fisherman'
          }], [{
            text: "விபத்துக்கான நிதி உதவி",
            callback_data: 'accidentclaim'
          }], [{
            text: "இறப்புக்கான நிதி உதவி",
            callback_data: 'deathclaim'
          }],
          [{
            text: "கைத்தறி நெசவாளர்",
            callback_data: 'handloom'
          }],
          [{
            text: "எழுத்தாளர் / பத்திரிக்கையாளர்",
            callback_data: 'writer'
          }],
        ]
      }
    });
  };


  const fisherManFn = async (ctx) => {
    isNoneOfTheAbove = true;
    isFisher=true;
    bot.telegram.sendMessage(ctx.chat.id, '[2/2] பயனாளியின் தேவை / வகை என்ன?', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: "மீன் பிடிப்பவர்",
            callback_data: "fisher"
          }], [{
            text: "மீன் வளர்த்தல்",
            callback_data: "fishy"
          }], [{
            text: "மீன் வளர்ப்பு குளம் அமைத்தல்",
            callback_data: "fishy_pond"
          }], [{
            text: "பள்ளி மாணவர்",
            callback_data: "schoolstudent"
          }],  [{
            text: "கல்லூரி மாணவர்",
            callback_data: "collegestudent"
          }],
          [{
            text: "திருமண உதவி",
            callback_data: "marriage"
          }],
          [{
            text: "இறப்பு/விபத்து-க்கான நிதி உதவி",
            callback_data: "death"
          }],
          [{
            text: "மகப்பபேறு கால நிதி உதவி",
            callback_data: "delivery"
          }]
        ]
      }
    });
    }

    const fisherOptionFn = async (ctx) => {
      isNoneOfTheAbove = true;
      isFisher = true;
      let fisherType = ctx.update.callback_query.data;
        const schemes = data.filter((item) => {
          if (item.isFisher === isFisher && item.fisherType.includes(fisherType)) {
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
            let requiredDocuments = '';
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
            if (scheme.requiredDocuments) {
              requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
            }
    
            if (scheme.url) {
              url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
            }
            let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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


      //handloom

      const handLoomFn = async (ctx) => {
        isNoneOfTheAbove = true;
        isHandLoomWeavers=true;
          const schemes = data.filter((item) => {
            if (item.isHandLoomWeavers ===  isHandLoomWeavers) {
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
              let requiredDocuments = '';
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
              if (scheme.requiredDocuments) {
                requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
              }
      
              if (scheme.url) {
                url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
              }
              let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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

  //accident claim

const accidentClaimFn = async (ctx) => {
          isNoneOfTheAbove = true;
          isNonDeath=true;
            const schemes = data.filter((item) => {
              if (item.isNonDeath ===  isNonDeath) {
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
                let requiredDocuments = '';
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
                if (scheme.requiredDocuments) {
                  requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
                }
        
                if (scheme.url) {
                  url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
                }
                let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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

      // deathclaim

const deathClaimFn = async (ctx) => {
        isNoneOfTheAbove = true;
        isDeath=true;
          const schemes = data.filter((item) => {
            if (item.isDeath ===  isDeath) {
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
              let requiredDocuments = '';
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
              if (scheme.requiredDocuments) {
                requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
              }
      
              if (scheme.url) {
                url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
              }
              let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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

//writer or jornalist

const writerFn = async (ctx) => {
  isNoneOfTheAbove = true;
  isWriter = true; 
  isJournalist = true
    const schemes = data.filter((item) => {
      if ((item.isWriter ===  isWriter) ||(item.isJournalist ===  isJournalist) ) {
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
        let requiredDocuments = '';
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
        if (scheme.requiredDocuments) {
          requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
        }

        if (scheme.url) {
          url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
        }
        let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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
// Creating gender

  const CategoryFn = (ctx) => {
  // categoryStudent = ctx.update.callback_query.data;
    ctx.replyWithHTML(`\n\n [2/6] பயனாளியின் பாலினத்தை தேர்வு செய்யவும்`, {
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

// Creating Community

  const genderFn = (ctx) => {
    gender = ctx.update.callback_query.data;
    let greet = greetingGender[gender] || ''
    bot.telegram.sendMessage(ctx.chat.id, `[3/6] நன்றி ${greet}! பயனாளி எந்த சமூகத்தைச் சேர்ந்தவர்? பின்வரும் ஒன்றைத் தேர்ந்தெடுக்கவும்.`, {
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

// Creating Education status

  const communityFn = (ctx) => {
    community = ctx.update.callback_query.data;
    bot.telegram.sendMessage(ctx.chat.id, '[4/6] பின்வருவனற்றுள் எது பயனாளியைக் குறிக்கும்?', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: "பள்ளி மாணவர் (1ம் வகுப்பு - 12ம் வகுப்பு)",
            callback_data: 'schoolStudent'
          }], [{
            text: "கல்லூரி மாணவர் (பட்ட/பட்டய/தொழிற்கல்வி/முனைவர் படிப்பு)",
            callback_data: 'collegeStudent'
          }]
        ]
      }
    });
  };

  // Creating Age 

  const studentFn = async (ctx) => {
    isSchoolStudent = ctx.update.callback_query.data === 'schoolStudent';
    isCollegeStudent = ctx.update.callback_query.data === 'collegeStudent';
    isStudent = isSchoolStudent || isCollegeStudent;
      bot.telegram.sendMessage(ctx.chat.id, '[5/6] பயனாளியின் வயது என்ன?', {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "30 அல்லது அதற்கும் கீழ்",
              callback_data: '30'
            }], [{
              text: "31-40",
              callback_data: '40'
            }], [{
              text: "41-50",
              callback_data: '50'
            }], [{
              text: "51-60",
              callback_data: '60'
            }],  [{
              text: "61-70",
              callback_data: '70'
            }], [{
              text: "71-80",
              callback_data: '80'
            }], [{
              text: "81-90",
              callback_data: '90'
            }], [{
              text: "100 அல்லது அதற்கும் மேல்",
              callback_data: '100'
            }]
          ]
        }
      });
    //  await sendFinalResultFn(ctx);
    
  };

// Creating Income

  const ageFn = (ctx) => {
    age = ctx.update.callback_query.data;
    bot.telegram.sendMessage(ctx.chat.id, '[6/6] உங்கள் குடும்பத்தின் அதிகபட்ச ஆண்டு வருமானம் என்ன என்ன?', {
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

  // Creating farmer requirements 

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

  // farmer filter 

  const farmerOptionsFn = async (ctx) => {
    isFarmer = true;
    let farmerNeeds =  ctx.update.callback_query.data;
    const schemes = data.filter((item) => {
      if (item.isFarmer === isFarmer && item.farmerNeeds.includes(farmerNeeds)) {
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
        let requiredDocuments = '';
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
        if (scheme.requiredDocuments) {
          requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
        }

        if (scheme.url) {
          url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
        }
        let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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


  // enterpreneur

    // Creating enterpreneur requirements 

    const enterpreneurFn = async (ctx) => {
    isEnterpreneur = true;
      bot.telegram.sendMessage(ctx.chat.id, '[2/2] பயனாளியின் தேவை / வகை என்ன?', {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "புதிதாக தொழில் தொடங்குவோர்",
              callback_data: "new"
            }], [{
              text: "<1 வருடமாக இயங்கி வருவது",
              callback_data: "one"
            }], [{
              text: "<2 வருடமாக இயங்கி வருவது",
              callback_data: "two"
            }], [{
              text: "<3 வருடமாக இயங்கி வருவது",
              callback_data: "three"
            }],  [{
              text: "<5 வருடமாக இயங்கி வருவது",
              callback_data: "five"
            }],
            [{
              text: "ஒப்பந்ததாரர்கள்(contractors)",
              callback_data: "contractors"
            }],
            [{
              text: "தொழில்சார் பயிற்சி",
              callback_data: "training"
            }]

          ]
        }
      });
    };

    // emterpreneur filter 

    const enterpreneurOptnFn = async (ctx) => {
    isEnterpreneur = true;
    let  yearLimit =  ctx.update.callback_query.data;
      const schemes = data.filter((item) => {
        if (item.isEnterpreneur === isEnterpreneur && item.yearLimit.includes(yearLimit)) {
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
          let requiredDocuments = '';
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
          if (scheme.requiredDocuments) {
            requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
          }
  
          if (scheme.url) {
            url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
          }
          let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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

// women category information    

const womenFn = async (ctx) => {
isWomen = true;
bot.telegram.sendMessage(ctx.chat.id, '[2/2] பயனாளியின் தேவை / வகை என்ன?', {
  reply_markup: {
    inline_keyboard: [
      [{
        text: "கைம்பெண்",
        callback_data: "Widow"
      }], [{
        text: "தனிநபர்",
        callback_data: "Single"
      }], [{
        text: "பிரிந்து வாழ்பவர்",
        callback_data: "Separated"
      }], [{
        text: "விவாக ரத்தானவர்",
        callback_data: "Divorced"
      }],  [{
        text: "மகப்பேறு",
        callback_data: "Maternity"
      }],
      [{
        text: "திருமண உதவி",
        callback_data: "MarriageAssit"
      }],
      [{
        text: "கருச் சிதைவு",
        callback_data: "Miscarriage"
      }],
      [{
        text: "மருத்துவ உதவி",
        callback_data: "Medical"
      }],
      [{
        text: "சுய தொழில்",
        callback_data: "SelfEmployment"
      }],
      [{
        text: "கடன்",
        callback_data: "IndividualLoan"
      }],


    ]
  }
});
};

// women filter

const womenOptionsFn = async (ctx) => {
  isWomen = true;
let womenType = ctx.update.callback_query.data;
const schemes = data.filter((item) => {
  if (item.isWomen === isWomen && item.womenType.includes(womenType)) {
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
    let requiredDocuments = '';
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
    if (scheme.requiredDocuments) {
      requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
    }

    if (scheme.url) {
      url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
    }
    let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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



// disability category information

  const differentlyAbledFn = async (ctx) => {
    isDifferntlyAbled = true;
    bot.telegram.sendMessage(ctx.chat.id, '[2/2] மாற்றுத் திறனாளித் தன்மையைத் தேர்வு செய்க?', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: "கை கால் இயக்க குறைபாடு",
            callback_data: "Locomotor_Disability"
          }], [{
            text: "பார்வை திறன் குறைபாடு",
            callback_data: "Visually_Impaired"
          }], [{
            text: "செவிதிறன் குறைபாடு",
            callback_data: "Hearing_Impaired"
          }], [{
            text: "மனவளர்ச்சி குன்றியோர்",
            callback_data: "Intellectual_Disability"
          }],  [{
            text: "புற உலக சிந்தனையாளர்",
            callback_data: "Autism_Spectrum_Disorder"
          }],
          [{
            text: "மன நலம் குன்றியோர்",
            callback_data: "mental_Illness"
          }],
          [{
            text: "தசை சிதைவு நோய்",
            callback_data: "Muscular_Dystrophy"
          }],
          [{
            text: "பல் வகை ஊனம்",
            callback_data: "more_than_one"
          }],
          [{
            text: "மூளை முடக்குவாதம்",
            callback_data: "Cerebral_Palsy"
          }],
          [{
            text: "மேற்கண்ட எதுவும் இல்லை",
            callback_data: "none_of_the_list"
          }]
        ]
      }
    });
  };

  // disability filter 

  const disabilitytypeFn = async (ctx) => {
    isDifferntlyAbled = true;
    let categoryOfDisability =  ctx.update.callback_query.data;
    const schemes = data.filter((item) => {
      console.log('schemes is ', schemes);
      if (item.isDifferntlyAbled === isDifferntlyAbled && item.categoryOfDisability.includes(categoryOfDisability)) {
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
        let requiredDocuments = '';
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
        if (scheme.requiredDocuments) {
          requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
        }

        if (scheme.url) {
          url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
        }
        let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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
// senior citizen
  const seniorCitizenFn = async (ctx) => {
    isSeniorCitizen = true;
      const schemes = data.filter((item) => {
      console.log('schemes is ', schemes);
        if (item.isSeniorCitizen=== isSeniorCitizen ) {
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
          let requiredDocuments = '';
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
          if (scheme.requiredDocuments) {
            requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
          }
  
          if (scheme.url) {
            url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
          }
          let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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
        let requiredDocuments = '';
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
        
        if (scheme.requiredDocuments) {
          requiredDocuments = `<b>தேவையான் ஆவணங்கள்</b>: ரூ${scheme.requiredDocuments}\n`;
        }

        if (scheme.url) {
          url = `மேலதிக விவரங்களுக்கு பின்வரும் தளத்தை அணுகவும்: ${scheme.url}\n`;
        }
        let currentMessage = `${index+1}) <b>திட்டத்தின் பெயர்</b>: ${scheme.name}\n<b>துறை</b>: ${scheme.department}\n\n${description}${education}${religion}${maxIncome}${eligibility}${requiredDocuments}\n<b>உதவித் தொகை</b>:\n ${benefits}\n${url}`;
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
// start
  bot.command('start', startFn);

  bot.on('text', startFn);
  bot.on('message', startFn);
  bot.action('start', startFn);
//Gender
  bot.action('male', genderFn);
  bot.action('female', genderFn);
  bot.action('transgender', genderFn);
//farmer
  bot.action('farmer', farmerFn);
  bot.action('seeds', farmerOptionsFn);
  bot.action('tools', farmerOptionsFn);
  bot.action('cattle', farmerOptionsFn);
  bot.action('fertilizer', farmerOptionsFn);
  bot.action('small_grain', farmerOptionsFn);

// disability

  bot.action('DifferntlyAbled', differentlyAbledFn);
  bot.action('Locomotor_Disability', disabilitytypeFn);
  bot.action('Visually_Impaired', disabilitytypeFn);
  bot.action('Hearing_Impaired', disabilitytypeFn);
  bot.action('Intellectual_Disability', disabilitytypeFn);
  bot.action('Autism_Spectrum_Disorder', disabilitytypeFn);
  bot.action('mental_Illness', disabilitytypeFn);
  bot.action('Muscular_Dystrophy', disabilitytypeFn);
  bot.action('more_than_one', disabilitytypeFn);
  bot.action('Cerebral_Palsy', disabilitytypeFn);
  bot.action('none_of_the_list', disabilitytypeFn);

// women
  bot.action('Women', womenFn);

  bot.action('Single', womenOptionsFn);
  bot.action('Separated', womenOptionsFn);
  bot.action('Divorced', womenOptionsFn);
  bot.action('Maternity', womenOptionsFn);
  bot.action('MarriageAssit', womenOptionsFn);
  bot.action('Miscarriage', womenOptionsFn);
  bot.action('Medical', womenOptionsFn);
  bot.action('SelfEmployment', womenOptionsFn);
  bot.action('IndividualLoan', womenOptionsFn);


  //enterpreneur

  bot.action('Entrepreneur', enterpreneurFn);
  bot.action('new', enterpreneurOptnFn);
  bot.action('one', enterpreneurOptnFn);
  bot.action('two', enterpreneurOptnFn);
  bot.action('three', enterpreneurOptnFn);
  bot.action('five', enterpreneurOptnFn);
  bot.action('contractors', enterpreneurOptnFn);
  bot.action('training', enterpreneurOptnFn);
  
//senior

bot.action('SeniorCitizen', seniorCitizenFn);

//student
  bot.action('student', CategoryFn);


//Community   
  bot.action('OC', communityFn);
  bot.action('BC', communityFn);
  bot.action('MBC', communityFn);
  bot.action('DNC', communityFn);
  bot.action('SC', communityFn);
  bot.action('ST', communityFn);
//Education

  bot.action('schoolStudent', studentFn);
  bot.action('collegeStudent', studentFn);
  bot.action('non-student', studentFn);
//writer
bot.action( 'writer', writerFn);
//isNoneOfTheAbove

bot.action('NoneOfTheAbove', noneOfTheAboveFn);
bot.action('fisherman', fisherManFn);
bot.action('accidentclaim', accidentClaimFn);
bot.action('deathclaim', deathClaimFn);
bot.action('handloom', handLoomFn);


//fisheopton

bot.action('fisher', fisherOptionFn);
bot.action('fishy', fisherOptionFn);
bot.action('fishy_pond', fisherOptionFn);
bot.action('schoolstudent', fisherOptionFn);
bot.action('collegestudent', fisherOptionFn);
bot.action('marriage', fisherOptionFn);
bot.action('death', fisherOptionFn);
bot.action('delivery', fisherOptionFn);

bot.action('contractors', enterpreneurOptnFn);
bot.action('training', enterpreneurOptnFn);

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