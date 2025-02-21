import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TranslateService } from '@ngx-translate/core';

import { VeronaPostService } from 'player/modules/verona/services/verona-post.service';

import { UnitComponent } from "./components";
import { NativeEventService } from './services/native-event.service';
import { MetaDataService } from './services/meta-data.service';

@Component({
  selector: 'stars-player',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isStandalone: boolean;

  constructor(private translateService: TranslateService,
              private nativeEventService: NativeEventService,
              private veronaPostService: VeronaPostService,
              private metaDataService: MetaDataService) {
    this.isStandalone = window === window.parent;
  }

  ngOnInit(): void {
    this.setLocales();
    this.veronaPostService.sendReadyNotification(this.metaDataService.playerMetadata);
    this.nativeEventService.focus
      .subscribe((isFocused: boolean) => this.veronaPostService
        .sendVopWindowFocusChangedNotification(isFocused));
  }

  private setLocales(): void {
    this.translateService.addLangs(['de']);
    this.translateService.setDefaultLang('de');
    registerLocaleData(localeDe);
  }
}
