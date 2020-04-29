import React, {ChangeEvent, useCallback, useRef} from 'react';
import './css/cra-editor.css'
import './css/iconfont.css'
import MdRenderer from './component/mdRenderer'
import {CraEditorProps} from "./types";

const CraEditor: React.FC<CraEditorProps> = ({value, onChange, options}) => {
    const subTool = useRef<HTMLUListElement | null>(null);
    const handleAdd = (alt: string) => {
        let newValue = value + '\n' + alt;
        onChange(newValue)
    };
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onChange(value);
    };
    const handleMouseEnter = () => {
        subTool.current!.style.display = 'block';
    };

    const handleMouseLeave = () => {
        subTool.current!.style.display = 'none';
    };

    return (
        <div className="cra-editor center">
            <div className="cra-tool-bar">
                <ul className='cra-tool-list'>
                    {
                        options!.h1 ?
                            <li onClick={() => handleAdd('# header 1')}><span className="cra-icon icon-H1"/></li> : ''
                    }
                    {
                        options!.h2 ?
                            <li onClick={() => handleAdd('## header 2')}><span className="cra-icon icon-H2"/></li> : ''
                    }
                    {
                        options!.h3 ?
                            <li onClick={() => handleAdd('### header 3')}><span className="cra-icon icon-H3"/></li> : ''
                    }
                    {
                        options!.h4 ?
                            <li onClick={() => handleAdd('#### header 4')}><span className="cra-icon icon-H4"/></li> : ''
                    }
                    {
                        options!.listOl ?
                            <li><span className="cra-icon icon-list-ol"/></li> : ''
                    }
                    {
                        options!.listUl ? <li><span className="cra-icon icon-list-ul"/></li> : ''
                    }
                    {
                        options!.upload ? (
                            <li onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} key={'uploadImg'} className='cra-upload-img'>
                        <span className="cra-icon icon-pic"/>
                        <ul onMouseLeave={handleMouseLeave} ref={subTool}>
                            <li key={'add'}>Add Image Link</li>
                            <li key={'import'}>Upload Image<input hidden={true} type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/></li>
                        </ul>
                    </li>
                        ) : ''
                    }
                    {
                        options!.link ? <li><span className="cra-icon icon-link"/></li> : ''
                    }
                    {
                        options!.code ? <li><span className="cra-icon icon-code"/></li> : ''
                    }
                    {
                        options!.save ? <li><span className="cra-icon icon-save"/></li> : ''

                    }
                </ul>
                <ul className='cra-editor-op'>
                    <li><span className="cra-icon icon-full-screen"/></li>
                    <li><span className="cra-icon icon-preview"/></li>
                    <li><span className="cra-icon icon-subfield"/></li>
                </ul>
            </div>
            <div className="cra-editor-main">
                <div className="cra-editor-edit cra-panel">
                    <textarea onChange={handleChange} value={value} placeholder={'开始编辑'}>

                    </textarea>
                </div>
                <div className="cra-editor-preview cra-panel">
                    <MdRenderer content={value} isBase64={false}/>
                </div>
            </div>
        </div>
    );
};

CraEditor.defaultProps = {
    options: {
        h1: true,
        h2: true,
        h3: true,
        h4: true,
        listOl: true,
        listUl: true,
        link: true,
        code: true,
        save: true,
        upload: true
    }
};

export default CraEditor;
