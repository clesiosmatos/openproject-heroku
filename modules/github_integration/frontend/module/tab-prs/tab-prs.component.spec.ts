import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ChangeDetectorRef, DebugElement, Component, Input } from '@angular/core';
import {I18nService} from 'core-app/modules/common/i18n/i18n.service';
import { OpIconComponent } from "core-app/modules/icon/icon.component";
import { GitActionsMenuDirective } from "core-app/modules/plugins/linked/openproject-github_integration/git-actions-menu/git-actions-menu.directive";
import { TabPrsComponent } from "core-app/modules/plugins/linked/openproject-github_integration/tab-prs/tab-prs.component";
import { HalResourceService } from "core-app/modules/hal/services/hal-resource.service";
import { APIV3Service } from "core-app/modules/apiv3/api-v3.service";
import { of } from "rxjs";
import { PullRequestComponent } from "core-app/modules/plugins/linked/openproject-github_integration/pull-request/pull-request.component";
import { By } from "@angular/platform-browser";

@Component({
  selector: 'op-date-time',
  template: '<p>OpDateTimeComponent </p>'
})
class OpDateTimeComponent {
  @Input()
  dateTimeValue:any;
}

describe('TabPrsComponent', () => {
  let component:TabPrsComponent;
  let fixture:ComponentFixture<TabPrsComponent>;
  let element:DebugElement;
  let halResourceService: jasmine.SpyObj<HalResourceService>;
  let changeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;
  const I18nServiceStub = {
    t: function(key:string) {
      return 'test translation';
    }
  }
  const APIV3Stub = {
    work_packages: {
      id: () => ({github_pull_requests: 'prpath'})
    }
  }
  const pullRequests = {
    elements: [
      {
        title: 'title 1',
        githubUser: {
          avatarUrl: 'githubUser 1 avatarUrl',
          htmlUrl: 'githubUser 1 htmlUrl',
          login: 'githubUser 1 login',
        },
        githubUpdatedAt: 'githubUser 1 githubUpdatedAt',
        repository: 'githubUser 1 repository',
        number: 'githubUser 1 number',
        checkRuns: [
          {
            name: 'githubUser 1 checkRun',
            outputTitle: 'githubUser 1 outputTitle',
            conclusion: 'githubUser 1 conclusion',
            status: 'githubUser 1 status',
            detailsUrl: 'githubUser 1 detailsUrl',
          }
        ],
      },
      {
        title: 'title 2',
        githubUser: {
          avatarUrl: 'githubUser 2 avatarUrl',
          htmlUrl: 'githubUser 2 htmlUrl',
          login: 'githubUser 2 login',
        },
        githubUpdatedAt: 'githubUser 2 githubUpdatedAt',
        repository: 'githubUser 2 repository',
        number: 'githubUser 2 number',
        checkRuns: [
          {
            name: 'githubUser 2 checkRun',
            outputTitle: 'githubUser 2 outputTitle',
            conclusion: 'githubUser 2 conclusion',
            status: 'githubUser 2 status',
            detailsUrl: 'githubUser 2 detailsUrl',
          }
        ],
      }
    ]
  }

  beforeEach(async () => {
    const halResourceServiceSpy = jasmine.createSpyObj('HalResourceService', ['get']);
    const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    // @ts-ignore
    halResourceServiceSpy.get.and.returnValue(of(pullRequests));

    await TestBed
      .configureTestingModule({
        declarations: [
          TabPrsComponent,
          OpIconComponent,
          GitActionsMenuDirective,
          PullRequestComponent,
          OpDateTimeComponent,
        ],
        providers: [
          { provide: I18nService, useValue: I18nServiceStub },
          { provide: HalResourceService, useValue: halResourceServiceSpy },
          { provide: APIV3Service, useValue: APIV3Stub },
          { provide: ChangeDetectorRef, useValue: changeDetectorSpy },
        ],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPrsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    halResourceService = fixture.debugElement.injector.get(HalResourceService) as jasmine.SpyObj<HalResourceService>;
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
    // @ts-ignore
    component.workPackage = { id: 'testId' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a PullRequestComponent per pull request', () => {
    const pullRequests = fixture.debugElement.queryAll(By.css('github-pull-request'));

    expect(pullRequests.length).toBe(2);
  });

  it('should display a message when there are no pull requests', () => {
    component.pullRequests = [];
    fixture.detectChanges();
    const pullRequests = fixture.debugElement.queryAll(By.css('github-pull-request'));
    const textMessage = fixture.debugElement.queryAll(By.css('p'));

    expect(pullRequests.length).toBe(0);
    expect(textMessage).toBeTruthy();
  });
});
