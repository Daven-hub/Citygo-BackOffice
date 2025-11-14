module.exports = {
      input: [
        'src/**/*.{js,jsx}', // les fichiers à scanner
        '!**/node_modules/**',
        '!**/dist/**'
      ],
      output: './public/locales', // dossier des traductions générées
      options: {
        debug: true,
        removeUnusedKeys: true,
        sort: true,
        lngs: ['en', 'fr'], // langues à gérer
        defaultLng: 'en',
        defaultNs: 'translation',
        ns: ['translation'],
        defaultValue: (lng, ns, key) => {
          if (lng === 'en') return key; // en anglais, la valeur par défaut = clé
          return '';
        },
      }
    };
    