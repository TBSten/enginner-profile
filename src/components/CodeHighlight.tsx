import Prism from "prismjs";
import { FC, useEffect, useReducer } from "react";

interface CodeHighlightProps {
    lang: string
    children: string
}
const CodeHighlight: FC<CodeHighlightProps> = ({ lang, children }) => {
    const [isMounted, mount] = useReducer(() => true, false)
    useEffect(() => {
        mount()
    }, [])
    useEffect(() => {
        if (isMounted) {
            (async () => {
                await import(`prismjs/components/prism-${lang}`)
                Prism.highlightAll()
            })()
        }
    }, [isMounted, children, lang])
    if (!isMounted) return <></>
    return (
        <pre>
            <code className={`language-${lang}`}>{children}</code>
        </pre>
    );
}

export default CodeHighlight;

