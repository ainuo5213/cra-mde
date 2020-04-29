export interface CraEditorProps {
    value: string;
    onChange: (value: string) => void;
    options?:Options
}

export interface Options {
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

export interface ToolOptions {
    [key: string]:JSX.Element
}