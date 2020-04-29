import React, {ChangeEvent, useRef, useState} from 'react';
import './css/cra-editor.css'
import './css/iconfont.css'
import MdRenderer from './component/mdRenderer'
import {CraEditorProps, Tool} from "./types";

const defaultTool: Tool = {
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
};

const CraEditor: React.FC<CraEditorProps> = ({value, onChange, tool, onSave, onUpload}) => {
    const subTool = useRef<HTMLUListElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [count, setCount] = useState<number>(1);
    const uploadImgRef = useRef<HTMLInputElement | null>(null);
    const mergedOptions = {...defaultTool, ...tool};
    const [fullScreen, setFullScreen] = useState<boolean>(false);


    const selectText = (startIndex: number, stopIndex: number) => {
        let area = textAreaRef.current as any;
        if (area.setSelectionRange) {
            area.setSelectionRange(startIndex, stopIndex);
        } else if (area.createTextRange) {//IE
            var range = area.createTextRange();
            range.collapse(true);
            range.moveStart('character', startIndex);
            range.moveEnd('character', stopIndex - startIndex);
            range.select();
        }
        area.focus();
    };

    const handleAdd = (alt: string, type: string) => {
        let sep = '\n';
        let newValue = '';
        let preValue = value;
        if (value !== '') {
            newValue = value + sep + alt
        } else {
            newValue = value + alt
        }
        let preLength = value.length;
        if (type[0] === 'h') {
            let index = +type[1] + 1;
            let newIndex = preValue === '' ? (preLength + index) : (preLength + index + 1);
            setTimeout(() => {
                selectText(newIndex, newValue.length)
            }, 0)
        } else if (type[0] === 'l') {
            let index = +type[1];
            let newIndex = preValue === '' ? (preLength + index) : (preLength + index + 1);
            setTimeout(() => {
                selectText(newIndex, newValue.length)
            }, 0);
            setCount(count => count + 1);
        } else if (type === 'pic') {
            let index = preValue === '' ? (preLength + 7) : (preLength + 8);
            setTimeout(() => {
                selectText(index, newValue.length - 1)
            }, 0);
        } else if (type === 'anchor') {
            let index = preValue === '' ? (preLength + 8) : (preLength + 9);
            setTimeout(() => {
                selectText(index, newValue.length - 1)
            }, 0);
        } else if (type === 'code') {
            let index = preValue === '' ? (preLength + 3) : (preLength + 4);
            setTimeout(() => {
                selectText(index, newValue.length - 5)
            }, 0);
        }
        onChange(newValue);
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

    const handleSave = () => {
        onSave && onSave(value);
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            let img = e.target.files && e.target.files.length && e.target.files[0];
            if (img) {
                onUpload && onUpload(img);
            }
        }
    };

    const handleScreenChange = () => {
        setFullScreen(full => !full)
    };

    return (
        <div className={"cra-editor center " + (fullScreen ? 'cra-full-screen' : '')}>
            <div className="cra-tool-bar">
                <ul className='cra-tool-list'>
                    {
                        mergedOptions!.h1 ?
                            <li onClick={() => handleAdd('# header 1', 'h1')}><span className="cra-icon icon-H1"/></li> : ''
                    }
                    {
                        mergedOptions!.h2 ?
                            <li onClick={() => handleAdd('## header 2', 'h2')}><span className="cra-icon icon-H2"/></li> : ''
                    }
                    {
                        mergedOptions!.h3 ?
                            <li onClick={() => handleAdd('### header 3', 'h3')}><span className="cra-icon icon-H3"/></li> : ''
                    }
                    {
                        mergedOptions!.h4 ?
                            <li onClick={() => handleAdd('#### header 4', 'h4')}><span className="cra-icon icon-H4"/></li> : ''
                    }
                    {
                        mergedOptions!.listOl ?
                            <li onClick={() => handleAdd(count + '. List item', 'l' + ((count + '').length + 2))}><span className="cra-icon icon-list-ol"/></li> : ''
                    }
                    {
                        mergedOptions!.listUl ?
                            <li onClick={() => handleAdd('- List item', 'l2')}><span className="cra-icon icon-list-ul"/></li> : ''
                    }
                    {
                        mergedOptions!.upload ? (
                            <li onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} key={'uploadImg'} className='cra-upload-img'>
                                <span className="cra-icon icon-pic"/>
                                <ul onMouseLeave={handleMouseLeave} ref={subTool}>
                                    <li onClick={() => handleAdd('![alt](url)', 'pic')}>Add Image Link</li>
                                    <li onClick={() => uploadImgRef.current && uploadImgRef.current.click()}>Upload Image<input onChange={handleUpload} ref={uploadImgRef} hidden={true} type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/></li>
                                </ul>
                            </li>
                        ) : ''
                    }
                    {
                        mergedOptions!.link ?
                            <li onClick={() => handleAdd('[title](url)', 'anchor')}><span className="cra-icon icon-link"/></li> : ''
                    }
                    {
                        mergedOptions!.code ?
                            <li onClick={() => handleAdd('```language\n\n```', 'code')}><span className="cra-icon icon-code"/></li> : ''
                    }
                    {
                        mergedOptions!.save ? <li onClick={handleSave}><span className="cra-icon icon-save"/></li> : ''
                    }
                </ul>
                <ul className='cra-editor-op'>
                    <li onClick={handleScreenChange} className={fullScreen ? 'active' : ''}>
                        {
                            fullScreen ? <span className="cra-icon icon-exit-screen"/> :
                                <span className="cra-icon icon-full-screen"/>
                        }
                    </li>
                    <li><span className="cra-icon icon-preview"/></li>
                    <li><span className="cra-icon icon-subfield"/></li>
                </ul>
            </div>
            <div className="cra-editor-main">
                <div className="cra-editor-edit cra-panel">
                    <div className="cra-editor-panel">
                        <textarea ref={textAreaRef} className="cra-scroll" onChange={handleChange} value={value} placeholder={'开始编辑'}>

                        </textarea>
                    </div>
                </div>
                <div className="cra-editor-preview cra-panel cra-scroll">
                    <MdRenderer content={value} isBase64={false}/>
                </div>
            </div>
        </div>
    );
};

export default CraEditor;
