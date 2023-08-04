import {
  TeachersView,
  TeachersResponse,
  TeacherNoteType,
  TeacherNoteViewType,
  TeacherNotesResponse,
  TeacherType,
  TeacherNotesView,
  TeacherViewType,
  BriefTeacherType,
  BriefTeacherViewType,
  DownloadedNotesResponse,
  DownloadedNotesView,
} from '../models';
import { Injectable } from '@angular/core';
import { initialDownloadDetailState } from 'src/app/shared/download/models/download-detail-state.model';
import { DownloadDetailStates } from 'src/app/shared/download/store/download-state.model';

@Injectable({ providedIn: 'root' })
export class Converter {
  fromTeacherType__TeacherViewType(teacher: TeacherType): TeacherViewType {
    return {
      id: teacher.id,
      name: teacher.name,
      shortName: teacher.short_name,
      address: teacher.address,
      email: teacher.email,
      isActive: teacher.is_active,
      library: teacher.library,
      logo: teacher.logo,
      phone: teacher.phone,
      subject: teacher.subject,
      userType: teacher.user_type,
      username: teacher.username,
    };
  }
  fromBriefTeacherType__BriefTeacherViewType(
    teacher: BriefTeacherType
  ): BriefTeacherViewType {
    const { id, name, preview_url, url } = teacher;
    return {
      id,
      name,
      previewUrl: preview_url,
      url,
    };
  }
  fromTeacherNoteType__TeacherNoteViewType(
    note: TeacherNoteType,
    teacher: BriefTeacherViewType
  ): TeacherNoteViewType {
    const { id, size, created_date, name, file_type, url } = note;
    return {
      id,
      size,
      createdDate: created_date,
      name,
      type: file_type,
      url,
      teacher,
    };
  }

  fromTeachersResponse__TeachersViewModel(
    teachersResponse: TeachersResponse
  ): TeachersView {
    const { count, next, previous, results } = teachersResponse;
    return {
      count,
      next,
      previous,
      results: results.map((teacher) =>
        this.fromTeacherType__TeacherViewType(teacher)
      ),
    };
  }

  fromTeacherNotesResponse__TeacherNotesViewType(
    teacherNotes: TeacherNotesResponse
  ): TeacherNotesView {
    const { results } = teacherNotes;
    const { notes, teacher } = results;
    const teacherView = this.fromBriefTeacherType__BriefTeacherViewType(
      teacher
    );
    return {
      results: {
        teacher: teacherView,
        notes: {
          count: notes.count,
          next: notes.next,
          previous: notes.previous,
          results: notes.results.map((note) => {
            return {
              ...initialDownloadDetailState,
              id: note.id,
              item: this.fromTeacherNoteType__TeacherNoteViewType(
                note,
                teacherView
              ),
            };
          }),
        },
      },
    };
  }

  fromDownloadedNotesResponse__DownloadedNotesView(
    response: DownloadedNotesResponse
  ): DownloadedNotesView {
    return {
      results: response.results.map((note) =>
        this.fromTeacherNoteType__TeacherNoteViewType(
          note,
          this.fromBriefTeacherType__BriefTeacherViewType(note.teacher)
        )
      ),
    };
  }

  fromBriefTeacherViewType__TeacherViewType(
    briefTeacherView: BriefTeacherViewType
  ): TeacherViewType {
    return {
      id: briefTeacherView.id,
      name: briefTeacherView.name,
      logo: briefTeacherView.url,
      address: null,
      email: null,
      isActive: true,
      library: null,
      phone: null,
      shortName: null,
      subject: null,
      userType: null,
      username: null,
    };
  }

  fromDownloadedTeacherNoteStateModel__TeachersView(
    downloadedNotes: DownloadDetailStates<TeacherNoteViewType>,
    query = ''
  ): TeachersView {
    const notesArray = Object.values(downloadedNotes);
    const teachers: TeachersView = {
      count: 0,
      next: '',
      previous: '',
      results: [],
    };

    const teacherIds = [];
    notesArray.forEach((state) => {
      if (teacherIds.indexOf(state.item.teacher.id) > -1) {
        return;
      }
      if (
        !state.item.teacher?.name.toLowerCase().includes(query.toLowerCase())
      ) {
        return;
      }
      teacherIds.push(state.item.teacher.id);
      teachers.results.push(
        this.fromBriefTeacherViewType__TeacherViewType(state.item.teacher)
      );
    });
    return teachers;
  }
}
