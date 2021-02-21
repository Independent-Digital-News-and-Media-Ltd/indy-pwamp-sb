import { State } from './utils/state';
import { buildMessageText } from './utils/buildMessageText';

export const EMAIL_ERROR_MESSAGE = 'Please enter a valid email address';

export class FormState extends State {
  constructor() {
    super({
      valid: false,
      offers: false,
      buttonText: '',
      showInputWidget: false,
      successMessage: '',
      submittingRequest: false,
      errorMessage: '',
      newsletters: {
        selected: [],
        intransit: [],
        subscribed: [],
      },
      email: {
        valid: false,
        dirty: false,
        touched: false,
        value: '',
      },
    });
  }

  startRequest() {
    this.data = {
      ...this.data,
      submittingRequest: true,
      newsletters: {
        ...this.data.newsletters,
        selected: [],
        intransit: this.data.newsletters.selected,
      },
    };

    this.digest();
  }

  onSuccess() {
    let showInputWidget = true;

    // close the input widget if no newsletters are selected
    if (this.data.newsletters.selected.length === 0) {
      showInputWidget = false;
    }

    this.data = {
      ...this.data,
      showInputWidget,
      successMessage: buildMessageText(this.data.newsletters.intransit.length),
      newsletters: {
        ...this.data.newsletters,
        intransit: [],
        // add intransit newsletters to subscribed array
        subscribed: [
          ...this.data.newsletters.subscribed,
          ...this.data.newsletters.intransit,
        ],
      },
    };

    this.digest();
  }

  onError(errorMessage) {
    // put intransit newsletters back into selected array
    const selected = [
      ...this.data.newsletters.selected,
      ...this.data.newsletters.intransit,
    ];

    this.data = {
      ...this.data,
      buttonText: buildMessageText(selected.length),
      errorMessage,
      newsletters: {
        ...this.data.newsletters,
        selected,
        intransit: [],
      },
    };

    this.digest();
  }

  endRequest() {
    this.data = {
      ...this.data,
      submittingRequest: false,
    };

    this.digest();
  }

  updateSelectedNewsletters(key, selected) {
    let selectedNewsletters = [];
    let showInputWidget = this.data.showInputWidget;

    if (selected) {
      selectedNewsletters = [...this.data.newsletters.selected, key];
    } else {
      selectedNewsletters = this.data.newsletters.selected.filter(
        (ns) => ns !== key,
      );
    }

    const valid = selectedNewsletters.length > 0 && this.data.email.valid;

    // if no newsletters are selected, we want to close the input widget
    if (selectedNewsletters.length > 0) {
      showInputWidget = true;
    } else {
      showInputWidget = false;
    }

    this.data = {
      ...this.data,
      showInputWidget,
      buttonText: buildMessageText(selectedNewsletters.length),
      newsletters: {
        ...this.data.newsletters,
        selected: selectedNewsletters,
      },
      valid,
    };

    this.digest();
  }

  markEmailFieldTouched() {
    this.data = {
      ...this.data,
      email: {
        ...this.data.email,
        touched: true,
      },
    };

    this.digest();
  }

  markEmailFieldDirty() {
    this.data = {
      ...this.data,
      // need to set this here too since change event occurs after input event
      errorMessage: !this.data.email.valid ? EMAIL_ERROR_MESSAGE : '',
      email: {
        ...this.data.email,
        dirty: true,
      },
    };

    this.digest();
  }

  setEmail(value, valid) {
    const formIsValid = valid && this.data.newsletters.selected.length > 0;

    this.data = {
      ...this.data,
      errorMessage: !valid && this.data.email.dirty ? EMAIL_ERROR_MESSAGE : '',
      valid: formIsValid,
      email: {
        ...this.data.email,
        value,
        valid,
      },
    };

    this.digest();
  }

  hideSuccessMessage() {
    this.data.successMessage = '';

    this.digest();
  }

  selectOffers() {
    this.data = {
      ...this.data,
      offers: true,
    };

    this.digest();
  }

  deselectOffers() {
    this.data = {
      ...this.data,
      offers: false,
    };

    this.digest();
  }
}
