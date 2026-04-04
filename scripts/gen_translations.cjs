const fs = require('fs');
const en = JSON.parse(fs.readFileSync('./src/i18n/locales/en.json','utf8'));

// Kannada translations - override key strings
const kn = JSON.parse(JSON.stringify(en));
Object.assign(kn.nav, {home:'ಹೋಮ್',about:'ನಮ್ಮ ಬಗ್ಗೆ',features:'ವೈಶಿಷ್ಟ್ಯಗಳು',aiTools:'AI ಉಪಕರಣಗಳು',lawyers:'ವಕೀಲರು',dashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',login:'ಲಾಗಿನ್',tryFree:'ಉಚಿತವಾಗಿ ಪ್ರಯತ್ನಿಸಿ',logout:'ಲಾಗ್‌ಔಟ್'});
Object.assign(kn.chat.sidebar, {aiTools:'AI ಉಪಕರಣಗಳು',assistant:'ಕಾನೂನು ಸಹಾಯಕ',analyzer:'ಡಾಕ್ಯುಮೆಂಟ್ ವಿಶ್ಲೇಷಕ',generator:'ಡಾಕ್ಯುಮೆಂಟ್ ಜನರೇಟರ್',predictor:'ಕೇಸ್ ಪ್ರಿಡಿಕ್ಟರ್',detector:'ನಕಲಿ ಡಾಕ್ ಡಿಟೆಕ್ಟರ್',pastCases:'ಹಿಂದಿನ ಕೇಸ್‌ಗಳು',newCase:'+ ಹೊಸ ಕೇಸ್',proMember:'ಪ್ರೊ ಸದಸ್ಯ'});
Object.assign(kn.chat.assistant, {title:'ಕಾನೂನು ಸಹಾಯಕ',greeting:'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ nyAI ಕಾನೂನು ಸಹಾಯಕ. ಭಾರತೀಯ ಕಾನೂನಿನಲ್ಲಿ ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',inputPlaceholder:'ಬಾಡಿಗೆ ಕಾನೂನು, FIR ಬಗ್ಗೆ ಕೇಳಿ...',analyzing:'ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',suggestion1:'ಬೆಂಗಳೂರಿನಲ್ಲಿ ನನ್ನ ಬಾಡಿಗೆದಾರ ಹಕ್ಕುಗಳೇನು?'});
Object.assign(kn.landing, {badge:'ಭಾರತದ ಮೊದಲ AI ಕಾನೂನು ಸಂಗಾತಿ',askNyai:'nyAI ಗೆ ಕೇಳಿ',getStarted:'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ',problemHeading:'ಕಾನೂನು ಸಹಾಯ',problemHighlight:'ಐಷಾರಾಮವಾಗಿರಬಾರದು.',featuresHeading:'ಎಲ್ಲವೂ ಕಾನೂನು.',featuresHighlight:'ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.',ctaHeading:'ನ್ಯಾಯದ ಕ್ರಾಂತಿಯಲ್ಲಿ',ctaHighlight:'ಸೇರಿಕೊಳ್ಳಿ.'});
Object.assign(kn.auth, {welcomeBack:'ಮರಳಿ ಸ್ವಾಗತ',signIn:'ಸೈನ್ ಇನ್',signUp:'ಖಾತೆ ರಚಿಸಿ',email:'ಇಮೇಲ್ ವಿಳಾಸ',password:'ಪಾಸ್‌ವರ್ಡ್',fullName:'ಪೂರ್ಣ ಹೆಸರು'});
Object.assign(kn.common, {loading:'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',error:'ಏನೋ ತಪ್ಪಾಯಿತು',tryAgain:'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',save:'ಉಳಿಸಿ',cancel:'ರದ್ದುಮಾಡಿ',close:'ಮುಚ್ಚಿ',submit:'ಸಲ್ಲಿಸಿ',search:'ಹುಡುಕಿ'});
Object.assign(kn.sos, {emergencyHelp:'ತುರ್ತು ಸಹಾಯ',buttonLabel:'ತುರ್ತು ಸಹಾಯ'});
fs.writeFileSync('./src/i18n/locales/kn.json', JSON.stringify(kn,null,2));

// Malayalam translations
const ml = JSON.parse(JSON.stringify(en));
Object.assign(ml.nav, {home:'ഹോം',about:'ഞങ്ങളെക്കുറിച്ച്',features:'ഫീച്ചറുകൾ',aiTools:'AI ടൂളുകൾ',lawyers:'അഭിഭാഷകർ',dashboard:'ഡാഷ്ബോർഡ്',login:'ലോഗിൻ',tryFree:'സൗജന്യമായി ശ്രമിക്കൂ',logout:'ലോഗൗട്ട്'});
Object.assign(ml.chat.sidebar, {aiTools:'AI ടൂളുകൾ',assistant:'നിയമ സഹായി',analyzer:'ഡോക്യുമെന്റ് വിശകലനം',generator:'ഡോക്യുമെന്റ് ജനറേറ്റർ',predictor:'കേസ് പ്രെഡിക്ടർ',detector:'വ്യാജ ഡോക് ഡിറ്റക്ടർ',pastCases:'കഴിഞ്ഞ കേസുകൾ',newCase:'+ പുതിയ കേസ്',proMember:'പ്രോ അംഗം'});
Object.assign(ml.chat.assistant, {title:'നിയമ സഹായി',greeting:'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ nyAI നിയമ സഹായിയാണ്. ഇന്ത്യൻ നിയമത്തിൽ ഇന്ന് എങ്ങനെ സഹായിക്കാം?',inputPlaceholder:'വാടക നിയമങ്ങൾ, FIR അല്ലെങ്കിൽ നിയമ അവകാശങ്ങളെക്കുറിച്ച് ചോദിക്കൂ...',analyzing:'വിശകലനം ചെയ്യുന്നു...',suggestion1:'കേരളത്തിൽ എന്റെ വാടകക്കാരന്റെ അവകാശങ്ങൾ എന്തൊക്കെ?'});
Object.assign(ml.landing, {badge:'ഇന്ത്യയുടെ ആദ്യ AI നിയമ സഹചാരി',askNyai:'nyAI-യോട് ചോദിക്കൂ',getStarted:'സൗജന്യമായി ആരംഭിക്കൂ',problemHeading:'നിയമ സഹായം',problemHighlight:'ആഡംബരമാകരുത്.',featuresHeading:'എല്ലാം നിയമപരം.',featuresHighlight:'എല്ലാം ഒരിടത്ത്.',ctaHeading:'നീതിയുടെ വിപ്ലവത്തിൽ',ctaHighlight:'ചേരൂ.'});
Object.assign(ml.auth, {welcomeBack:'തിരികെ സ്വാഗതം',signIn:'സൈൻ ഇൻ',signUp:'അക്കൗണ്ട് സൃഷ്ടിക്കൂ',email:'ഇമെയിൽ വിലാസം',password:'പാസ്‌വേഡ്',fullName:'മുഴുവൻ പേര്'});
Object.assign(ml.common, {loading:'ലോഡ് ചെയ്യുന്നു...',error:'എന്തോ തെറ്റ് സംഭവിച്ചു',tryAgain:'വീണ്ടും ശ്രമിക്കൂ',save:'സേവ്',cancel:'റദ്ദാക്കൂ',close:'അടയ്ക്കൂ',submit:'സമർപ്പിക്കൂ',search:'തിരയൂ'});
Object.assign(ml.sos, {emergencyHelp:'അടിയന്തര സഹായം',buttonLabel:'അടിയന്തര സഹായം'});
fs.writeFileSync('./src/i18n/locales/ml.json', JSON.stringify(ml,null,2));

// Punjabi translations
const pa = JSON.parse(JSON.stringify(en));
Object.assign(pa.nav, {home:'ਹੋਮ',about:'ਸਾਡੇ ਬਾਰੇ',features:'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',aiTools:'AI ਟੂਲ',lawyers:'ਵਕੀਲ',dashboard:'ਡੈਸ਼ਬੋਰਡ',login:'ਲੌਗਇਨ',tryFree:'ਮੁਫ਼ਤ ਵਿੱਚ ਅਜ਼ਮਾਓ',logout:'ਲੌਗਆਊਟ'});
Object.assign(pa.chat.sidebar, {aiTools:'AI ਟੂਲ',assistant:'ਕਾਨੂੰਨੀ ਸਹਾਇਕ',analyzer:'ਦਸਤਾਵੇਜ਼ ਵਿਸ਼ਲੇਸ਼ਕ',generator:'ਦਸਤਾਵੇਜ਼ ਜਨਰੇਟਰ',predictor:'ਕੇਸ ਪ੍ਰਿਡਿਕਟਰ',detector:'ਨਕਲੀ ਡਾਕ ਡਿਟੈਕਟਰ',pastCases:'ਪਿਛਲੇ ਕੇਸ',newCase:'+ ਨਵਾਂ ਕੇਸ',proMember:'ਪ੍ਰੋ ਮੈਂਬਰ'});
Object.assign(pa.chat.assistant, {title:'ਕਾਨੂੰਨੀ ਸਹਾਇਕ',greeting:'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ nyAI ਕਾਨੂੰਨੀ ਸਹਾਇਕ ਹਾਂ। ਭਾਰਤੀ ਕਾਨੂੰਨ ਵਿੱਚ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',inputPlaceholder:'ਕਿਰਾਏ ਦੇ ਕਾਨੂੰਨ, FIR ਜਾਂ ਕਾਨੂੰਨੀ ਅਧਿਕਾਰਾਂ ਬਾਰੇ ਪੁੱਛੋ...',analyzing:'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...',suggestion1:'ਚੰਡੀਗੜ੍ਹ ਵਿੱਚ ਮੇਰੇ ਕਿਰਾਏਦਾਰ ਅਧਿਕਾਰ ਕੀ ਹਨ?'});
Object.assign(pa.landing, {badge:'ਭਾਰਤ ਦਾ ਪਹਿਲਾ AI ਕਾਨੂੰਨੀ ਸਾਥੀ',askNyai:'nyAI ਨੂੰ ਪੁੱਛੋ',getStarted:'ਮੁਫ਼ਤ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ',problemHeading:'ਕਾਨੂੰਨੀ ਮਦਦ',problemHighlight:'ਐਸ਼ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।',featuresHeading:'ਸਭ ਕੁਝ ਕਾਨੂੰਨੀ।',featuresHighlight:'ਸਭ ਇੱਕ ਥਾਂ।',ctaHeading:'ਨਿਆਂ ਦੀ ਕ੍ਰਾਂਤੀ ਵਿੱਚ',ctaHighlight:'ਸ਼ਾਮਲ ਹੋਵੋ।'});
Object.assign(pa.auth, {welcomeBack:'ਵਾਪਸ ਆਉਣ ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ',signIn:'ਸਾਈਨ ਇਨ',signUp:'ਖਾਤਾ ਬਣਾਓ',email:'ਈਮੇਲ ਪਤਾ',password:'ਪਾਸਵਰਡ',fullName:'ਪੂਰਾ ਨਾਮ'});
Object.assign(pa.common, {loading:'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',error:'ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ',tryAgain:'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ',save:'ਸੇਵ ਕਰੋ',cancel:'ਰੱਦ ਕਰੋ',close:'ਬੰਦ ਕਰੋ',submit:'ਜਮ੍ਹਾਂ ਕਰੋ',search:'ਖੋਜੋ'});
Object.assign(pa.sos, {emergencyHelp:'ਐਮਰਜੈਂਸੀ ਮਦਦ',buttonLabel:'ਐਮਰਜੈਂਸੀ ਮਦਦ'});
fs.writeFileSync('./src/i18n/locales/pa.json', JSON.stringify(pa,null,2));

console.log('All 3 files created successfully');
