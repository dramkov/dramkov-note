import { useRef, useState } from 'react';
import MonacoEditor, { OnChange } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import './code-editor.css';

interface CodeEditorProps {
  initialValue: string;
  setInput(value: any): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, setInput }) => {
  const editorRef = useRef<any>();
  const [value, setValue] = useState('');

  const onChangeHandler: OnChange = (value, editor) => {
    editorRef.current = value;
    setInput(value);
  };

  const onFormatCLick = () => {
    const unformatted = editorRef.current;
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');
    setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatCLick}
      >
        Format
      </button>
      <MonacoEditor
        value={value}
        onChange={onChangeHandler}
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        theme='vs-dark'
        language='javascript'
        height='100%'
      />
    </div>
  );
};

export default CodeEditor;
