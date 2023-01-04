import '../../style/components/write/tag-box.scss';
import React, { useCallback, useEffect, useState } from 'react';

const TagItem = React.memo(({ tag, onRemove }) => (
  <div className="tag" onClick={() => onRemove(tag)}>
    #{tag}
  </div>
));
const TagList = React.memo(({ tags, onRemove }) => (
  <div className="tag-list-block">
    {tags &&
      tags.map((tag) => <TagItem key={tag} tag={tag} onRemove={onRemove} />)}
  </div>
));

const TagBox = ({ tags, onChangeTags }) => {
  const [input, setInput] = useState('');
  const [localTags, setLocalTags] = useState([]);

  const insertTag = useCallback(
    (tag) => {
      if (!tag) return;
      if (localTags.includes(tag)) return;
      const nextTags = [...localTags, tag];
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );
  const onRemove = useCallback(
    (tag) => {
      const nextTags = localTags.filter((t) => t !== tag);
      setLocalTags(nextTags);
      onChangeTags(nextTags);
    },
    [localTags, onChangeTags],
  );
  const onChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      insertTag(input.trim());
      setInput('');
    },
    [input, insertTag],
  );

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);
  return (
    <div className="tag-box-block">
      <h4>태그</h4>
      <form className="tag-form" onSubmit={onSubmit}>
        <input
          placeholder="태그를 적어주세요."
          value={input}
          onChange={onChange}
        />
        <button type="submit">추가</button>
      </form>
      <TagList tags={localTags} onRemove={onRemove} />
    </div>
  );
};

export default TagBox;
