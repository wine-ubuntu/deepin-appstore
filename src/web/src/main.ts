import {
  enableProdMode,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT,
  MissingTranslationStrategy,
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// use the require method provided by webpack
declare const require;

async function main() {
  // Native client mode.
  if (window['QWebChannel']) {
    const channel = await new Promise<any>(resolve => {
      // noinspection TsLint
      // tslint:disable-next-line:no-unused-expression
      new window['QWebChannel'](window['qt'].webChannelTransport, resolve);
    });
    window['dstore'] = {};
    window['dstore']['channel'] = channel;

    const servers = await new Promise(resolve => {
      channel.objects.settings.getServers(resolve);
    });
    environment.metadataServer = servers['metadataServer'];
    environment.operationServer = servers['operationServer'];
    environment.themeName = servers['themeName'];
    if (Boolean(servers['aot'])) {
      return await platformBrowserDynamic().bootstrapModule(AppModule);
    }
  }
  // loading locale
  for (let language of navigator.languages) {
    language = language.replace('-', '_');
    try {
      const translations = require(`raw-loader!./locale/messages.${language}.xlf`);
      if (translations != null) {
        return await platformBrowserDynamic().bootstrapModule(AppModule, {
          missingTranslation: MissingTranslationStrategy.Warning,
          providers: [
            { provide: TRANSLATIONS, useValue: translations },
            { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
          ],
        });
      }
      break;
    } catch (err) {
      console.error('cannot load locale', language, err);
    }
  }
  return await platformBrowserDynamic().bootstrapModule(AppModule);
}
main();
