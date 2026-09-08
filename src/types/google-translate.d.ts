declare namespace google.translate {
  class TranslateElement {
    static InlineLayout: {
      SIMPLE: number;
    };

    constructor(
      options: {
        pageLanguage: string;
        layout: number;
        autoDisplay: boolean;
      },
      element: string,
    );
  }
}

interface Window {
  googleTranslateElementInit?: () => void;
}