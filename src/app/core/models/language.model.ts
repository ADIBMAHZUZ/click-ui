const enum Attributes {
  LOGIN = 'LOGIN.',
  LOGIN__FORGOT_PASSWORD = 'LOGIN.FORGOT_PASSWORD.',
  LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL = 'LOGIN.FORGOT_PASSWORD.FORGOT_PASSWORD_MODAL.',
  LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL = 'LOGIN.FORGOT_PASSWORD.CHECK_TOKEN_MODAL.',
  LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN = 'LOGIN.FORGOT_PASSWORD.CREATE_NEW_TOKEN.',
  LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN__ALERT = 'LOGIN.FORGOT_PASSWORD.CREATE_NEW_TOKEN.ALERT.',
  //
  NAVBAR = 'NAVBAR.',
  NAVBAR__ALERT = 'NAVBAR.ALERT',
  //
  HOME = 'HOME.',
  HOME__LIBRARY__MEDIA = 'HOME.LIBRARY.MEDIA.',
  HOME__LIBRARY__BOOK = 'HOME.LIBRARY.BOOK.',
  HOME__LIBRARY__BOOK__LIST = 'HOME.LIBRARY.BOOK.LIST.',
  HOME__LIBRARY__BOOK__DETAIL = 'HOME.LIBRARY.BOOK.DETAIL.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS = 'HOME.LIBRARY.BOOK.DETAIL.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__DO_YOU_WANT_TO_RETURN_THIS = 'HOME.LIBRARY.BOOK.DETAIL.DO_YOU_WANT_TO_RETURN_THIS.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__NO_INTERNET_CONNECTION = 'HOME.LIBRARY.BOOK.DETAIL.NO_INTERNET_CONNECTION.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__INVALID_BOOK = 'HOME.LIBRARY.BOOK.DETAIL.INVALID_BOOK.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED = 'HOME.LIBRARY.BOOK.DETAIL.CHOOSE_DATE_FAILED.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__BORROW_SUCCESSFULLY = 'HOME.LIBRARY.BOOK.DETAIL.BORROW_SUCCESSFULLY.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__BORROW_FAILED = 'HOME.LIBRARY.BOOK.DETAIL.BORROW_FAILED.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__PREVIEW_FAILED = 'HOME.LIBRARY.BOOK.DETAIL.PREVIEW_FAILED.',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__VIEW_FAILED = 'HOME.LIBRARY.BOOK.DETAIL.VIEW_FAILED',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__EXTEND_SUCCESSFULLY = 'HOME.LIBRARY.BOOK.DETAIL.EXTEND_FAILED',
  HOME__LIBRARY__BOOK__DETAIL__ALERTS__EXTEND_FAILED = 'HOME.LIBRARY.BOOK.DETAIL.EXTEND_FAILED',
  //
  MEDIA = 'MEDIA.',
  MEDIA__WISHLIST = 'MEDIA.WISHLIST.',
  MEDIA__DOWNLOAD = 'MEDIA.DOWNLOAD.',
}
export const multiLanguageModel: MultiLanguageModel = {
  LOGIN: {
    lang: Attributes.LOGIN + 'lang',
    welcome: Attributes.LOGIN + 'welcome',
    username: Attributes.LOGIN + 'username',
    password: Attributes.LOGIN + 'password',
    login: Attributes.LOGIN + 'login',
    forgot_password: Attributes.LOGIN + 'forgot_password',
    user_re: Attributes.LOGIN + 'user_re',
    pass_re: Attributes.LOGIN + 'pass_re',
    wrong_acc: Attributes.LOGIN + 'wrong_acc',
    the_account_is_inactive: Attributes.LOGIN + 'the_account_is_inactive',
    this_account_is_using_by: Attributes.LOGIN + 'this_account_is_using_by',
    this_account_is_logged_more:
      Attributes.LOGIN + 'this_account_is_logged_more',
    no_internet: Attributes.LOGIN + 'no_internet',
    force_return_media: Attributes.LOGIN + 'force_return_media',
    mentioned_books_has_expired:
      Attributes.LOGIN + 'mentioned_books_has_expired',

    FORGOT_PASSWORD: {
      FORGOT_PASSWORD_MODAL: {
        request_password_token:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL +
          'request_password_token',
        username:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL + 'username',
        email:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL + 'email',
        please_enter_username:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL +
          'please_enter_username',
        please_enter_a_email_address:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL +
          'please_enter_a_email_address',
        _50_characters_is_maximum_permitted:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL +
          '_50_characters_is_maximum_permitted',
        please_enter_a_real_email:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL +
          'please_enter_a_real_email',
        send: Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL + 'send',
        cancel:
          Attributes.LOGIN__FORGOT_PASSWORD__FORGOT_PASSWORD_MODAL + 'cancel',
      },
      CHECK_TOKEN_MODAL: {
        confirm_email_token:
          Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL +
          'confirm_email_token',
        retrieve_password_token:
          Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL +
          'retrieve_password_token',
        message:
          Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL + 'message',
        resend_message:
          Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL +
          'resend_message',
        resend: Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL + 'resend',
        check: Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL + 'check',
        cancel: Attributes.LOGIN__FORGOT_PASSWORD__CHECK_TOKEN_MODAL + 'cancel',
      },
      CREATE_NEW_TOKEN: {
        create_new_password:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN +
          'create_new_password',
        new_password:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN + 'new_password',
        please_enter_new_password:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN +
          'please_enter_new_password',
        confirm_new_password:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN +
          'confirm_new_password',
        please_enter_confirm_password:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN +
          'please_enter_confirm_password',
        password_6_characters_is_minimum_length_permitted:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN +
          'password_6_characters_is_minimum_length_permitted',
        confirm_password_6_characters_is_minimum_length_permitted:
          Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN +
          'confirm_password_6_characters_is_minimum_length_permitted',
        submit: Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN + 'submit',
        cancel: Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN + 'cancel',
        ALERT: {
          title:
            Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN__ALERT +
            'title',
          message:
            Attributes.LOGIN__FORGOT_PASSWORD__CREATE_NEW_TOKEN__ALERT +
            'message',
        },
      },
    },
  },
  NAVBAR: {
    home: Attributes.NAVBAR + 'home',
    logout: Attributes.NAVBAR + 'logout',
    search: Attributes.NAVBAR + 'search',
    hi: Attributes.NAVBAR + 'hi',
    school_virtual_resource_center:
      Attributes.NAVBAR + 'school_virtual_resource_center',
    ALERT: {
      logout: Attributes.NAVBAR__ALERT + 'logout',
      ok: Attributes.NAVBAR__ALERT + 'ok',
      cancel: Attributes.NAVBAR__ALERT + 'cancel',
      message: Attributes.NAVBAR__ALERT + 'message',
    },
  },
  HOME: {
    library: Attributes.HOME + 'library',
    school_news: Attributes.HOME + 'school_news',
    teacher_notes: Attributes.HOME + 'teacher_notes',
    material: Attributes.HOME + 'material',
    school_history: Attributes.HOME + 'school_history',
    student_content: Attributes.HOME + 'student_content',

    LIBRARY: {
      MEDIA: {
        book: Attributes.HOME__LIBRARY__MEDIA + 'book',
        video: Attributes.HOME__LIBRARY__MEDIA + 'video',
        audio: Attributes.HOME__LIBRARY__MEDIA + 'audio',
      },

      BOOK: {
        LIST: {
          see_all: Attributes.HOME__LIBRARY__BOOK__LIST + 'see_all',
          search: Attributes.HOME__LIBRARY__BOOK__LIST + 'search',
          lastest: Attributes.HOME__LIBRARY__BOOK__LIST + 'lastest',
        },

        DETAIL: {
          authors: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'authors',
          size: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'size',
          paperback: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'paperback',
          publisher: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'publisher',
          language: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'language',
          category: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'category',
          remaining_borrow_times:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'remaining_borrow_times',
          available_media:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'available_media',
          preview: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'preview',
          view: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'view',
          listen: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'listen',
          return: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'return',
          borrow: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'borrow',
          downloading: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'downloading',
          extend: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'extend',
          time_remaining:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'time_remaining',
          days: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'days',
          hours: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'hours',
          minutes: Attributes.HOME__LIBRARY__BOOK__DETAIL + 'minutes',
          product_description:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'product_description',
          no_any_preview_images:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'no_any_preview_images',
          continue_to_download:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'continue_to_download',
          downloading_media_has:
            Attributes.HOME__LIBRARY__BOOK__DETAIL + 'downloading_media_has',

          ALERTS: {
            your_media_is_returned_to:
              Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS +
              'your_media_is_returned_to',
            you_reach_the_limit_of:
              Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS +
              'you_reach_the_limit_of',
            please_try_again_later:
              Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS +
              'please_try_again_later',
            DO_YOU_WANT_TO_RETURN_THIS: {
              do_you_want_to_return_this:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__DO_YOU_WANT_TO_RETURN_THIS +
                'do_you_want_to_return_this',
              ok:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__DO_YOU_WANT_TO_RETURN_THIS +
                'ok',
              cancel:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__DO_YOU_WANT_TO_RETURN_THIS +
                'cancel',
            },

            NO_INTERNET_CONNECTION: {
              title:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__NO_INTERNET_CONNECTION +
                'title',
              message:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__NO_INTERNET_CONNECTION +
                'message',
            },
            INVALID_BOOK: {
              title:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__INVALID_BOOK +
                'title',
              message:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__INVALID_BOOK +
                'message',
            },
            CHOOSE_DATE_FAILED: {
              choose_date_failed:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED +
                'choose_date_failed',
              a_date_after_today:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED +
                'a_date_after_today',
              a_date_after_expiration_time:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED +
                'a_date_after_expiration_time',
              please_borrow:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED +
                'please_borrow',
              please_extend:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED +
                'please_extend',
              days_at_most:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__CHOOSE_DATE_FAILED +
                'days_at_most',
            },
            BORROW_SUCCESSFULLY: {
              borrow_successfully:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__BORROW_SUCCESSFULLY +
                'borrow_successfully',
              borrow_is_successfully__have:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__BORROW_SUCCESSFULLY +
                'borrow_is_successfully__have',
            },
            BORROW_FAILED: {
              borrow_failed:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__BORROW_FAILED +
                'borrow_failed',
              borrow_is_not_available:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__BORROW_FAILED +
                'borrow_is_not_available',
            },
            PREVIEW_FAILED: {
              preview_failed:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__PREVIEW_FAILED +
                'preview_failed',
              preview_is_not_available:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__PREVIEW_FAILED +
                'preview_is_not_available',
            },
            VIEW_FAILED: {
              view_failed:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__VIEW_FAILED +
                'view_failed',
              view_is_not_available_please:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__VIEW_FAILED +
                'view_is_not_available_please',
            },
            EXTEND_SUCCESSFULLY: {
              extend_successfully_:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__EXTEND_SUCCESSFULLY +
                'extend_successfully_',
              extend_is_successful__have:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__EXTEND_SUCCESSFULLY +
                'extend_is_successful__have',
            },
            EXTEND_FAILED: {
              extend_failed:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__EXTEND_FAILED +
                'extend_failed',
              extend_failed_please_try_again:
                Attributes.HOME__LIBRARY__BOOK__DETAIL__ALERTS__EXTEND_FAILED +
                'extend_failed_please_try_again',
            },
          },
        },
      },
    },
  },
  MEDIA: {
    DOWNLOAD: {
      on_progress: Attributes.MEDIA__DOWNLOAD + 'on_progress',
      no_any_book_is_downloading:
        Attributes.MEDIA__DOWNLOAD + 'no_any_book_is_downloading',
      downloaded_media: Attributes.MEDIA__DOWNLOAD + 'downloaded_media',
      no_any_book_is_downloaded:
        Attributes.MEDIA__DOWNLOAD + 'no_any_book_is_downloaded',
      cancel: Attributes.MEDIA__DOWNLOAD + 'cancel',
    },
    WISHLIST: {
      audio: Attributes.MEDIA__WISHLIST + 'audio',
      book: Attributes.MEDIA__WISHLIST + 'book',
      video: Attributes.MEDIA__WISHLIST + 'video',
      see_all: Attributes.MEDIA__WISHLIST + 'see_all',
    },
  },
};
// Generated by https://quicktype.io

export interface MultiLanguageModel {
  LOGIN: Login;
  NAVBAR: Navbar;
  HOME: Home;
  MEDIA: Media;
}

export interface Home {
  library: string;
  school_news: string;
  teacher_notes: string;
  material: string;
  school_history: string;
  student_content: string;
  LIBRARY: Library;
}

export interface Library {
  MEDIA: Wishlist;
  BOOK: Book;
}

export interface Book {
  LIST: List;
  DETAIL: Detail;
}

export interface Detail {
  authors: string;
  size: string;
  paperback: string;
  publisher: string;
  language: string;
  category: string;
  remaining_borrow_times: string;
  available_media: string;
  preview: string;
  view: string;
  listen: string;
  return: string;
  borrow: string;
  downloading: string;
  extend: string;
  time_remaining: string;
  days: string;
  hours: string;
  minutes: string;
  product_description: string;
  no_any_preview_images: string;
  continue_to_download: string;
  downloading_media_has: string;
  ALERTS: Alerts;
}

export interface Alerts {
  DO_YOU_WANT_TO_RETURN_THIS: DoYouWantToReturnThis;
  your_media_is_returned_to: string;
  you_reach_the_limit_of: string;
  please_try_again_later: string;
  NO_INTERNET_CONNECTION: NoInternetConnection;
  INVALID_BOOK: InvalidBook;
  CHOOSE_DATE_FAILED: ChooseDateFailed;
  BORROW_SUCCESSFULLY: BorrowSuccessfully;
  BORROW_FAILED: BorrowFailed;
  PREVIEW_FAILED: PreviewFailed;
  VIEW_FAILED: ViewFailed;
  EXTEND_SUCCESSFULLY: ExtendSuccessfully;
  EXTEND_FAILED: ExtendFailed;
}

export interface BorrowFailed {
  borrow_failed: string;
  borrow_is_not_available: string;
}

export interface BorrowSuccessfully {
  borrow_successfully: string;
  borrow_is_successfully__have: string;
}

export interface ChooseDateFailed {
  choose_date_failed: string;
  a_date_after_today: string;
  a_date_after_expiration_time: string;
  please_borrow: string;
  please_extend: string;
  days_at_most: string;
}

export interface DoYouWantToReturnThis {
  do_you_want_to_return_this: string;
  ok: string;
  cancel: string;
}

export interface ExtendFailed {
  extend_failed: string;
  extend_failed_please_try_again: string;
}

export interface ExtendSuccessfully {
  extend_successfully_: string;
  extend_is_successful__have: string;
}

export interface InvalidBook {
  title: string;
  message: string;
}

export interface NoInternetConnection {
  title: string;
  message: string;
}

export interface PreviewFailed {
  preview_failed: string;
  preview_is_not_available: string;
}

export interface ViewFailed {
  view_failed: string;
  view_is_not_available_please: string;
}

export interface List {
  see_all: string;
  search: string;
  lastest: string;
}

export interface Wishlist {
  book: string;
  video: string;
  audio: string;
  see_all?: string;
}

export interface Login {
  lang: string;
  welcome: string;
  username: string;
  password: string;
  login: string;
  forgot_password: string;
  user_re: string;
  pass_re: string;
  wrong_acc: string;
  the_account_is_inactive: string;
  this_account_is_using_by: string;
  this_account_is_logged_more: string;
  no_internet: string;
  force_return_media: string;
  mentioned_books_has_expired: string;
  FORGOT_PASSWORD: ForgotPassword;
}

export interface ForgotPassword {
  FORGOT_PASSWORD_MODAL: ForgotPasswordModal;
  CHECK_TOKEN_MODAL: CheckTokenModal;
  CREATE_NEW_TOKEN: CreateNewToken;
}

export interface CheckTokenModal {
  confirm_email_token: string;
  retrieve_password_token: string;
  message: string;
  resend_message: string;
  resend: string;
  check: string;
  cancel: string;
}

export interface CreateNewToken {
  create_new_password: string;
  new_password: string;
  please_enter_new_password: string;
  confirm_new_password: string;
  please_enter_confirm_password: string;
  password_6_characters_is_minimum_length_permitted: string;
  confirm_password_6_characters_is_minimum_length_permitted: string;
  submit: string;
  cancel: string;
  ALERT: CreateNewTokenAlert;
}

export interface CreateNewTokenAlert {
  title: string;
  message: string;
}

export interface ForgotPasswordModal {
  request_password_token: string;
  username: string;
  email: string;
  please_enter_username: string;
  please_enter_a_email_address: string;
  _50_characters_is_maximum_permitted: string;
  please_enter_a_real_email: string;
  send: string;
  cancel: string;
}

export interface Media {
  DOWNLOAD: Download;
  WISHLIST: Wishlist;
}

export interface Download {
  on_progress: string;
  no_any_book_is_downloading: string;
  downloaded_media: string;
  no_any_book_is_downloaded: string;
  cancel: string;
}

export interface Navbar {
  home: string;
  logout: string;
  search: string;
  hi: string;
  school_virtual_resource_center: string;
  ALERT: NavbarAlert;
}

export interface NavbarAlert {
  logout: string;
  ok: string;
  cancel: string;
  message: string;
}
