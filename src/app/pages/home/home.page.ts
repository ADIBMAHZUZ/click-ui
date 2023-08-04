import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/store/auth.state';
import { CoreState } from 'src/app/core/store';
import { SubSink } from 'subsink';
import { UpdateProfile } from 'src/app/auth/store/auth.actions';
import { NetworkService } from '@core-services';

const defaultStyles = {
  entireBackgroundType: 'image',
  entireBackgroundImage: '/assets/images/home/home-library.jpg',
  entireBackgroundColor: '#00ff00',
  mediaTitleColor: '#ffffff',
  mediaBorderColor: '#ffffff50',
  mediaBadgeColor: '#00a2d2',
  mediaIconColor: '#ffffff',
  mediaBackgroundTransparent: null,
  mediaBackgroundType: 'color',
  mediaBackgroundColor: '#00000070',
  mediaBackgroundImage: '/assets/images/home/home-library.jpg',
  schoolNewsBoardTitleColor: '#ffffff',
  schoolNewsBoardBorderColor: '#ffffff50',
  schoolNewsBoardBadgeColor: '#09d172',
  schoolNewsBoardIconColor: '#ffffff',
  schoolNewsBoardBackgroundTransparent: null,
  schoolNewsBoardBackgroundType: 'color',
  schoolNewsBoardBackgroundColor: '#00000070',
  schoolNewsBoardBackgroundImage: '/assets/images/home/home-school-news.jpg',
  teacherNotesTitleColor: '#ffffff',
  teacherNotesBorderColor: '#ffffff50',
  teacherNotesBadgeColor: '#a30303',
  teacherNotesIconColor: '#ffffff',
  teacherNotesBackgroundTransparent: null,
  teacherNotesBackgroundType: 'color',
  teacherNotesBackgroundColor: '#00000070',
  teacherNotesBackgroundImage: '/assets/images/home/home-teacher-notes.jpg',
  learningMaterialTitleColor: '#ffffff',
  learningMaterialBorderColor: '#ffffff50',
  learningMaterialBadgeColor: '#ff4417',
  learningMaterialIconColor: '#ffffff',
  learningMaterialBackgroundTransparent: null,
  learningMaterialBackgroundColor: '#00000070',
  learningMaterialBackgroundImage: '/assets/images/home/home-material.jpg',
  learningMaterialBackgroundType: 'color',
  theSchoolHistoryTitleColor: '#ffffff',
  theSchoolHistoryBorderColor: '#ffffff50',
  theSchoolHistoryBadgeColor: '#ffc100',
  theSchoolHistoryIconColor: '#ffffff',
  theSchoolHistoryBackgroundTransparent: null,
  theSchoolHistoryBackgroundType: 'color',
  theSchoolHistoryBackgroundColor: '#00000070',
  theSchoolHistoryBackgroundImage: '/assets/images/home/home-material.jpg',
  studentContentTitleColor: '#ffffff',
  studentContentBorderColor: '#ffffff50',
  studentContentIconColor: '#ffffff',
  studentContentBadgeColor: '#ffea00',
  studentContentBackgroundTransparent: null,
  studentContentBackgroundType: 'color',
  studentContentBackgroundColor: '#00000070',
  studentContentBackgroundImage: '/assets/images/home/home-student-content.jpg',
};
@Component({
  selector: 'app-library',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  titles: any[];
  homeBackground: any;
  language: string;

  private _subSink = new SubSink();

  constructor(private _store: Store, private _network: NetworkService) {}

  async ionViewWillEnter() {
    this.language = this._store.selectSnapshot(CoreState.getLanguage);
    if (this._network.isConnected()) {
      await this._store.dispatch(new UpdateProfile()).toPromise();
    }
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    let styles = userInfo?.library;

    if (!userInfo?.library?.entireBackgroundType) {
      styles = {
        ...styles,
        ...defaultStyles,
      };
    }

    // Style for entire background

    switch (styles.entireBackgroundType) {
      case 'image':
        this.homeBackground = `--background: url(${styles.entireBackgroundImage}) no-repeat center center / cover;`;
        break;
      case 'color':
        this.homeBackground = `--background: ${styles.entireBackgroundColor}; `;
        break;
      default:
        this.homeBackground = `--background: url(/assets/images/home/home-school-history.jpg) no-repeat center center / cover;`;
        break;
    }

    this.titles = [
      {
        type: styles.mediaBackgroundType,
        src: styles.mediaBackgroundImage,
        color: styles.mediaTitleColor,
        bgColor: styles.mediaBackgroundColor,
        borderColor: styles.mediaBorderColor,
        badgeColor: styles.mediaBadgeColor,
        iconColor: styles.mediaIconColor,
        titleEn: styles.mediaTitleEn,
        titleMs: styles.mediaTitleMs,
      },
      {
        type: styles.schoolNewsBoardBackgroundType,
        src: styles.schoolNewsBoardBackgroundImage,
        color: styles.schoolNewsBoardTitleColor,
        bgColor: styles.schoolNewsBoardBackgroundColor,
        borderColor: styles.schoolNewsBoardBorderColor,
        badgeColor: styles.schoolNewsBoardBadgeColor,
        iconColor: styles.schoolNewsBoardIconColor,
        titleEn: styles.schoolNewsBoardTitleEn,
        titleMs: styles.schoolNewsBoardTitleMs,
      },
      {
        type: styles.teacherNotesBackgroundType,
        src: styles.teacherNotesBackgroundImage,
        color: styles.teacherNotesTitleColor,
        bgColor: styles.teacherNotesBackgroundColor,
        borderColor: styles.teacherNotesBorderColor,
        badgeColor: styles.teacherNotesBadgeColor,
        iconColor: styles.teacherNotesIconColor,
        titleEn: styles.teacherNotesTitleEn,
        titleMs: styles.teacherNotesTitleMs,
      },
      {
        type: styles.learningMaterialBackgroundType,
        src: styles.learningMaterialBackgroundImage,
        color: styles.learningMaterialTitleColor,
        bgColor: styles.learningMaterialBackgroundColor,
        borderColor: styles.learningMaterialBorderColor,
        badgeColor: styles.learningMaterialBadgeColor,
        iconColor: styles.learningMaterialIconColor,
        titleEn: styles.learningMaterialTitleEn,
        titleMs: styles.learningMaterialTitleMs,
      },
      {
        type: styles.theSchoolHistoryBackgroundType,
        src: styles.theSchoolHistoryBackgroundImage,
        color: styles.theSchoolHistoryTitleColor,
        bgColor: styles.theSchoolHistoryBackgroundColor,
        borderColor: styles.theSchoolHistoryBorderColor,
        badgeColor: styles.theSchoolHistoryBadgeColor,
        iconColor: styles.theSchoolHistoryIconColor,
        titleEn: styles.theSchoolHistoryTitleEn,
        titleMs: styles.theSchoolHistoryTitleMs,
      },
      {
        type: styles.studentContentBackgroundType,
        src: styles.studentContentBackgroundImage,
        color: styles.studentContentTitleColor,
        bgColor: styles.studentContentBackgroundColor,
        borderColor: styles.studentContentBorderColor,
        badgeColor: styles.studentContentBadgeColor,
        iconColor: styles.studentContentIconColor,
        titleEn: styles.studentContentTitleEn,
        titleMs: styles.studentContentTitleMs,
      },
    ];
  }
  ionViewWillLeave() {
    this._subSink.unsubscribe();
  }
  getBackground(i): any {
    const title = this.titles[i];
    let resultStyle = '';

    switch (title.type) {
      case 'image':
        resultStyle += `
        --background-image: url(${title.src});`;
        break;
      case 'transparent':
        resultStyle += `background: transparent; 
        --background-image: url('');`;
        resultStyle += `border: .25px solid ${title.borderColor};`;
        break;
      case 'color':
        resultStyle += `background: ${title.bgColor}; 
          --background-image: url('');`;
        resultStyle += `border: .25px solid ${title.borderColor};`;
        break;
      default:
    }
    resultStyle += `color: ${title.color};`;
    resultStyle += `--badge-color: ${title.badgeColor};`;
    resultStyle += `--icon-color: ${title.iconColor};`;
    return resultStyle;
  }
  getHomeBackground(): any {
    const userInfo = this._store.selectSnapshot(AuthState.getUserInfo);
    const {
      entireBackgroundColor,
      entireBackgroundImage = 'assets/images/home/home-teacher-notes.jpg',
      entireBackgroundType = 'image',
    } = userInfo.library;

    let resultStyle = '';

    switch (entireBackgroundType) {
      case 'image':
        resultStyle += `--background: url(${entireBackgroundImage}) no-repeat center center / cover;`;
        break;
      case 'color':
        resultStyle += `background-color: ${entireBackgroundColor}; `;
        break;
      default:
        break;
    }

    this.homeBackground = resultStyle;
  }
}
