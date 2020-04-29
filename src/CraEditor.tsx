import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import classnames from 'classnames'
import './css/cra-editor.css'
import './css/iconfont.css'
import MdRenderer from './component/mdRenderer'
import {CraEditorProps, Tool} from "./types";
import {language} from './config'

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

const CraEditor: React.FC<CraEditorProps> = ({value, onChange, tool, onSave, onUpload, animate = true, scroll = true, lang = 'cn'}) => {
    const subTool = useRef<HTMLUListElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [count, setCount] = useState<number>(1);
    const uploadImgRef = useRef<HTMLInputElement | null>(null);
    const mergedOptions = {...defaultTool, ...tool};
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [preview, setPreview] = useState<boolean>(false);
    const [fullPreview, setFullPreview] = useState<boolean>(false);
    const previewRef = useRef<HTMLDivElement | null>(null);

    const [editorScrollIng, setEditorScrollIng] = useState<boolean>(false);
    const [previewScrollIng, setPreviewScrollIng] = useState<boolean>(false);

    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const currentTimeout = useRef<any>(null);

    const title = (language as any)[lang] || language['cn'];

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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handlePreview = () => {
        setPreview(view => !view)
    };

    const handlePreviewV2 = () => {
        setPreview(false);
        if (preview) {
            setFullPreview(false);
        } else {
            setFullPreview(fullPreview => !fullPreview);
        }
    };

    const scrollEditor = () => {
        if (scroll) {
            // 编辑器区域滚动的时候，不触发预览区的滚动
            setEditorScrollIng(true);
            if (previewScrollIng) {
                setPreviewScrollIng(false);
                setEditorScrollIng(false);
                return;
            }
            doScroll(textAreaRef.current!, previewRef.current!)
        }
    };

    const doScroll = (scrollDom: HTMLElement, followScrollDom: HTMLElement) => {
        let percent = Math.floor((scrollDom.scrollTop / (scrollDom.scrollHeight - scrollDom.offsetHeight)) * 100) / 100;
        followScrollDom.scrollTop = (followScrollDom.scrollHeight - followScrollDom.offsetHeight) * percent
    };

    const scrollPreview = () => {
        // 预览区滚动的时候，不触发编辑器区域的滚动
        if (scroll) {
            setPreviewScrollIng(true);
            if (editorScrollIng) {
                setPreviewScrollIng(false);
                setEditorScrollIng(false);
                return;
            }
            doScroll(previewRef.current!, textAreaRef.current!)
        }
    };

    const preventDefault = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey && e.keyCode === 83) || (e.ctrlKey && e.keyCode === 83)) {
            e.preventDefault();
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.keyCode === 83) {
            onSave && onSave(value);
        } else if (e.ctrlKey && e.keyCode === 90) {
            undo()
        } else if (e.ctrlKey && e.keyCode === 89) {
            redo()
        }
    };

    const saveHistory = (value: string) => {
        // 撤销后修改，删除当前以后记录
        history.splice(historyIndex + 1, history.length);
        if (history.length >= 20) {
            history.shift()
        }
        history.push(value);
        setHistory([...history]);
        setHistoryIndex(history.length - 1);
    };

    useEffect(() => {
        clearTimeout(currentTimeout.current!);
        if (value !== history[historyIndex]) {
            const handler = () => {
                saveHistory(value);
            };
            currentTimeout.current = setTimeout(handler, 500);
            return () => {
                clearTimeout(currentTimeout.current);
            }
        }
    }, [value, historyIndex, history, saveHistory]);

    // 撤销
    const undo = () => {
        const index = historyIndex - 1;
        if (index < 0) return;
        onChange(history[index]);
        setHistoryIndex(index);
    };

    const redo = () => {
        let index = historyIndex + 1;
        if (historyIndex >= history.length - 1) return;
        onChange(history[index]);
        setHistoryIndex(index);
    };


    return (
        <div className={
            classnames({
                'cra-full-screen': fullScreen,
                'cra-editor': true,
                'center': true
            })}>
            <div className="cra-tool-bar">
                <ul className='cra-tool-list'>
                    {
                        mergedOptions!.h1 ?
                            <li title={title.h1} onClick={() => handleAdd('# header 1', 'h1')}><span
                                className="cra-icon icon-H1"/>
                            </li> : ''
                    }
                    {
                        mergedOptions!.h2 ?
                            <li title={title.h2} onClick={() => handleAdd('## header 2', 'h2')}><span
                                className="cra-icon icon-H2"/>
                            </li> : ''
                    }
                    {
                        mergedOptions!.h3 ?
                            <li title={title.h3} onClick={() => handleAdd('### header 3', 'h3')}><span
                                className="cra-icon icon-H3"/>
                            </li> : ''
                    }
                    {
                        mergedOptions!.h4 ?
                            <li title={title.h4} onClick={() => handleAdd('#### header 4', 'h4')}><span
                                className="cra-icon icon-H4"/>
                            </li> : ''
                    }
                    {
                        mergedOptions!.listOl ?
                            <li title={title.listOl}
                                onClick={() => handleAdd(count + '. List item', 'l' + ((count + '').length + 2))}><span
                                className="cra-icon icon-list-ol"/></li> : ''
                    }
                    {
                        mergedOptions!.listUl ?
                            <li title={title.listUl} onClick={() => handleAdd('- List item', 'l2')}><span
                                className="cra-icon icon-list-ul"/>
                            </li> : ''
                    }
                    {
                        mergedOptions!.upload ? (
                            <li onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} key={'uploadImg'}
                                className='cra-upload-img'>
                                <span className="cra-icon icon-pic"/>
                                <ul onMouseLeave={handleMouseLeave} ref={subTool}>
                                    <li onClick={() => handleAdd('![alt](url)', 'pic')}>Add Image Link</li>
                                    <li onClick={() => uploadImgRef.current && uploadImgRef.current.click()}>Upload
                                        Image<input onChange={handleUpload} ref={uploadImgRef} hidden={true} type="file"
                                                    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/></li>
                                </ul>
                            </li>
                        ) : ''
                    }
                    {
                        mergedOptions!.link ?
                            <li title={title.link} onClick={() => handleAdd('[title](url)', 'anchor')}><span
                                className="cra-icon icon-link"/></li> : ''
                    }
                    {
                        mergedOptions!.code ?
                            <li title={title.code} onClick={() => handleAdd('```language\n\n```', 'code')}><span
                                className="cra-icon icon-code"/></li> : ''
                    }
                    {
                        mergedOptions!.save ? <li onClick={handleSave}><span className="cra-icon icon-save"/></li> : ''
                    }
                </ul>
                <ul className='cra-editor-op'>
                    <li title={fullScreen ? title.exitFullScreen : title.fullScreen} onClick={handleScreenChange}
                        className={classnames({active: fullScreen})}>
                        {
                            fullScreen ? <span className="cra-icon icon-exit-screen"/> :
                                <span className="cra-icon icon-full-screen"/>
                        }
                    </li>
                    <li title={(fullPreview || preview) ? title.exitPreview : title.preview}
                        onClick={handlePreviewV2} className={classnames({
                        "active": fullPreview || preview
                    })}>{
                        preview ? <span className="cra-icon icon-un-preview"/> :
                            <span className="cra-icon icon-preview"/>
                    }</li>
                    <li title={preview ? title.singleColumn : title.doubleColumns} onClick={handlePreview}
                        className={classnames({active: preview})}><span
                        className={"cra-icon icon-subfield"}/></li>
                </ul>
            </div>
            <div className="cra-editor-main">
                <div className={classnames({
                    'cra-editor-edit': true,
                    'cra-panel': true,
                    'cra-active': preview,
                    'cra-animate': animate,
                    'full-preview': fullPreview,
                })}>
                    <div className="cra-editor-panel">
                        <textarea onKeyUp={handleKeyUp} onKeyDown={preventDefault} onScroll={scrollEditor}
                                  ref={textAreaRef} className="cra-scroll"
                                  onChange={handleChange} value={value}
                                  placeholder={'开始编辑'}>

                        </textarea>
                    </div>
                </div>
                <div onScroll={scrollPreview} ref={previewRef} className={classnames({
                    'cra-editor-preview': true,
                    'cra-panel': true,
                    'cra-active': preview,
                    'cra-scroll': true,
                    'cra-animate': animate,
                    'full-preview': fullPreview,
                })}>
                    <MdRenderer content={value} isBase64={false}/>
                </div>
            </div>
        </div>
    );
};

export default CraEditor;
