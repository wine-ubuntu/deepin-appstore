import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as ScrollIntoView from 'scroll-into-view/scrollIntoView';

import { App } from '../../dstore/services/app';
import { AppService } from '../../services/app.service';
import { BaseService } from '../../dstore/services/base.service';
import { CanvasUtil } from '../../utils/canvas-util';
import { StoreService } from '../../services/store.service';
import { AppJobStatus } from '../../services/store-job-info';

@Component({
  selector: 'app-app-detail',
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.scss'],
})
export class AppDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private storeService: StoreService,
  ) {}

  open = this.storeService.openApp;

  AppJobStatus = AppJobStatus;
  status$: Observable<AppJobStatus>;
  size$: Observable<number>;
  metadataServer: string;
  appObs: Observable<App>;

  ngOnInit() {
    this.metadataServer = BaseService.serverHosts.metadataServer;
    this.appObs = this.route.paramMap.mergeMap(param => {
      const appName = param.get('appName');
      console.log('app name:', appName);
      return this.appService.getApp(appName).do(app => console.log('app info:', app));
    });

    this.status$ = this.appObs
      .mergeMap(app =>
        Observable.timer(0, 1000).mergeMap(() =>
          this.storeService.appInstalled(app.name).mergeMap(exists => {
            if (exists) {
              return Observable.of(AppJobStatus.finish);
            } else {
              return this.storeService
                .getJobByName(app.name)
                .map(info => (info ? AppJobStatus.running : AppJobStatus.ready));
            }
          }),
        ),
      )
      .shareReplay();
    this.size$ = this.appObs.mergeMap(app => this.storeService.appDownloadSize(app.name));
  }

  install(appName: string) {
    this.storeService.installPackage(appName).subscribe();
  }

  screenshotClick(elID: string) {
    // chrome 61 support
    // const opt: ScrollIntoViewOptions = {
    //   behavior: 'smooth',
    //   inline: 'center',
    //   block: 'nearest',
    // };
    // (<HTMLElement>event.target).scrollIntoView(opt);

    ScrollIntoView(document.getElementById(elID));
  }

  previewImage(img: HTMLImageElement) {
    window['dstore'].channel.objects.imageViewer.openBase64(CanvasUtil.getBase64Image(img));
  }

  log(v) {
    console.log(v);
  }
}
