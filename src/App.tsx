import React, {useState} from 'react';
import Editor from './CraEditor'

const Test: React.FC<any> = () => {
    const [value, setValue] = useState<string>('');
    const handleChange = (value: string) => {
        setValue(value);
    };
    return (
        <Editor onChange={handleChange} value={value}/>
    );
};

export default Test;
