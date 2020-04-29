import React from 'react'
import 'github-markdown-css'
import MarkDownIt from 'markdown-it'
import {memo, useMemo} from 'react'
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-light.css'

const md: any = new MarkDownIt({
    // 将md转换成html
    html: true,
    // 将md中的链接转化成a标签
    linkify: true,
    // 添加代码高亮
    highlight: function (str, lang) {
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");

        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

const base64ToUTF8 = (str: string) => {
    return decodeURIComponent(escape(atob(str)))
};

interface Props {
    content: string;
    isBase64?: boolean
}

const MdRenderer: React.FC<Props> = memo(({content, isBase64 = false}) => {
    const markdown = isBase64 ? base64ToUTF8(content) : content;
    // 只要markdown不发生改变，那么html就不发生改变，那么该组件就不会发生变化
    const html = useMemo(() => md.render(markdown), [markdown]);
    return (
        <div className={'markdown-body'}>
            <div dangerouslySetInnerHTML={{__html: html}}/>
        </div>
    )
});

export default MdRenderer