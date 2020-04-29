export interface CraEditorProps {
    value: string;
    onChange: (value: string) => void;
    tool?: Tool,
    onSave?: (value: string) => void;
    onUpload?: (file: File) => void;
    animate?: boolean;
    scroll?: boolean;
    lang?: any
}

export interface Tool {
    h1?: boolean;
    h2?: boolean;
    h3?: boolean;
    h4?: boolean;
    listOl?: boolean;
    listUl?: boolean;
    upload?: true;
    link?: boolean;
    code?: boolean;
    save?: boolean;
}

export interface Language {
    cn: {
        [key: string]: string
    },
    en: {
        [key: string]: string
    },
}
