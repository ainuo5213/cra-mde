import React, {useState} from 'react';
import Editor from './CraEditor'

const Test: React.FC<any> = () => {
    const [value, setValue] = useState<string>(`> \`for-editor\` is a markdown editor

# for-editor

this is a markdown editor

## for-editor

this is a markdown editor

### for-editor

\`\`\`js
const editor = 'for-editor'
\`\`\`

- item1
  - subitem1
  - subitem2
  - subitem3
- item2
- item3

---

1. item1
2. item2
3. item3

### table

| title      | description     |
| ---------- | --------------- |
| for-editor | markdown editor |
`);
    const handleChange = (value: string) => {
        setValue(value);
    };
    const handleSave = (value: string) => {
        console.log(value)
    };
    return (
        <Editor lang={'en'} onSave={handleSave} onChange={handleChange} value={value}/>
    );
};

export default Test;
