import React, {useState} from 'react';
import Editor from './CraEditor'

const Test: React.FC<any> = () => {
    const [value, setValue] = useState<string>('');
    const handleChange = (value: string) => {
        setValue(value);
    };
    const handleSave = (value: string) => {
        console.log(value);
    };
    return (
        <Editor tool={{
            h1: false
        }} onSave={handleSave} onChange={handleChange} value={value}/>
    );
};

export default Test;
