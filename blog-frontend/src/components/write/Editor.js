import { useEffect, useRef } from 'react';
import '../../style/components/common/responsive.scss';
import '../../style/components/write/editor.scss';
import Quill from 'quill';

const Editor = ({ onChangeField, title, body }) => {
  const quillEl = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    quillInstance.current = new Quill(quillEl.current, {
      theme: 'bubble',
      placeholder: '내용을 적어주세요.',
      modules: {
        toolbar: [
          [{ header: '1' }, { header: '2' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });

    const quill = quillInstance.current;
    quill.on('text-change', (delta, oldDelta, source) => {
      if (source === 'user') {
        onChangeField({ key: 'body', value: quill.root.innerHTML });
      }
    });
  }, [onChangeField]);

  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    quillInstance.current.root.innerHTML = body || '';
  }, [body]);

  const onChangeTitle = (e) => {
    onChangeField({ key: 'title', value: e.target.value });
  };

  return (
    <div className="editor">
      <input
        className="title-input"
        placeholder="제목을 적어주세요."
        value={title}
        onChange={onChangeTitle}
      />
      <div className="quill-wrapper">
        <div ref={quillEl} />
      </div>
    </div>
  );
};

export default Editor;
