const LANGUAGE_DETECTOR = {

    type: 'languageDetector',
  
    async: true,
  
    detect: callback => {
  
      AsyncStorage.getItem('user-language', (err, language) => {
  
        // if error fetching stored data or no language was stored
  
        // display errors when in DEV mode as console statements
  
        if (err || !language) {
  
          if (err) {
  
            console.log('Error fetching Languages from asyncstorage ', err);
  
          } else {
  
            console.log('No language is set, choosing English as fallback');
  
          }
  
          const findBestAvailableLanguage =
  
            RNLocalize.findBestAvailableLanguage(LANG_CODES);
  
  
          callback(findBestAvailableLanguage.languageTag || 'en');
  
          return;
  
        }
  
        callback(language);
  
      });
  
    },
  
    init: () => {},
  
    cacheUserLanguage: language => {
  
      AsyncStorage.setItem('user-language', language);
  
    }
  
  };